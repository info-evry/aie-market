import prisma from "@/lib/prisma";
import { Order, Prisma, PrismaClient, Product, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import _Stripe from "stripe";
export const stripe = new _Stripe(process.env.STRIPE_SECRET ?? "", {
    apiVersion: "2024-09-30.acacia",
    typescript: true,
});

export class Stripe {
    /**
     * Checks if a user has a stripe customer id
     *
     * @throws Error if user not found
     */
    public static async userHasSripeId(userId: string): Promise<boolean> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (user === null) {
                throw new Error("User not found");
            }

            if (!user.stripeCustomerId) {
                return false;
            }

            return true;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to check if user has stripe id");
        }
    }

    /**
     * Creates a stripe customer for a user
     *
     * @throws Error if user not found
     */
    public static async createStripeCustomer(userId: string): Promise<string> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

            if (user === null) {
                throw new Error("User not found");
            }

            const customer = await stripe.customers.create({
                email: user.email,
            });

            await prisma.user.update({
                where: { id: userId },
                data: { stripeCustomerId: customer.id },
            });

            return customer.id;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create stripe customer");
        }
    }

    /**
     * Gets the price of a product based on the user role
     */
    public static getCustomizedPrice(user: User, product: Product): number {
        switch (user.role) {
            case "ADMIN":
            case "BOARD":
            case "MEMBER":
                return product.priceMember;
            default:
                return product.priceExternal;
        }
    }

    /**
     * Creates a checkout session for a user and an order
     *
     * @throws Error if no products are found
     */
    public static async createCheckoutSession(
        user: User,
        order: Order,
        tx: Omit<
            PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
            "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
        > = prisma,
    ): Promise<{ sessionId: string; amount: number; url: string }> {
        try {
            const products = await tx.product.findMany({
                where: {
                    consumption: {
                        some: {
                            orderId: order.id,
                        },
                    },
                },
            });

            const orderProducts = await tx.orderProduct.findMany({
                where: {
                    orderId: order.id,
                },
            });

            if (products.length === 0) {
                throw new Error("We can't create a checkout session without products");
            }

            if (!user.stripeCustomerId) {
                user.stripeCustomerId = await this.createStripeCustomer(user.id);
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                allow_promotion_codes: true,
                line_items: products.map((product) => ({
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: product.title,
                            description: product.description ?? "",
                        },
                        unit_amount: Stripe.getCustomizedPrice(user, product),
                    },
                    quantity:
                        orderProducts.find((el) => el.productId === product.id)?.quantity ?? 1,
                })),
                customer: user.stripeCustomerId,
                success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
            });

            if (!session.url) {
                throw new Error("Unable to create checkout session: url not found");
            }

            return {
                sessionId: session.id,
                amount: products.reduce(
                    (acc, product) => acc + Stripe.getCustomizedPrice(user, product),
                    0,
                ),
                url: session.url,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create checkout session");
        }
    }

    /**
     * Check if a stripe event has already been processed
     *
     * @throws DatabaseError if query fails
     */
    public static async checkIsProcessed(event: _Stripe.Checkout.Session): Promise<boolean> {
        return (await prisma.processEvent.findFirst({ where: { stripeId: event.id } })) !== null;
    }

    /**
     * Handles a checkout session completed event
     */
    public static async handleSessionComplete(event: _Stripe.Checkout.Session): Promise<boolean> {
        try {
            if (await Stripe.checkIsProcessed(event)) {
                return true;
            }

            // Validate the checkout session transaction
            await prisma.$transaction(async (tx) => {
                await tx.transaction.update({
                    where: { checkoutSessionId: event.id },
                    data: {
                        status: "SUCCEEDED",
                    },
                });
                // Send mail to the customer
                const user = await tx.user.findUnique({
                    where: { stripeCustomerId: event.customer as string },
                });

                let order = await tx.order.findFirst({
                    where: {
                        Transaction: {
                            checkoutSessionId: event.id,
                        },
                    },
                });

                if (order === null) {
                    throw new Error("Order not found");
                }

                if (user === null) {
                    throw new Error("User not found");
                }

                fetch(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_URL}/mailCommand`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstname: user.name,
                        name: user.name,
                        mail: user.email,
                        noCommande: order.id,
                    }),
                });
            });

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Handles a checkout session expired event
     */
    public static async handleSessionExpire(event: _Stripe.Checkout.Session): Promise<boolean> {
        try {
            if (await Stripe.checkIsProcessed(event)) {
                return true;
            }

            // Validate the checkout session transaction
            await prisma.$transaction(async (tx) => {
                await tx.transaction.update({
                    where: { checkoutSessionId: event.id },
                    data: {
                        status: "EXPIRED",
                    },
                });

                await tx.processEvent.create({
                    data: {
                        stripeId: event.id,
                        type: "checkout.session.expired",
                    },
                });
            });

            return true;
        } catch (error) {
            return false;
        }
    }
}
