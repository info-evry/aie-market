import { auth } from "@/lib/auth";
import { handleValidationError } from "@/lib/error";
import prisma from "@/lib/prisma";
import { Stripe } from "@/lib/stripe";
import { createOrder } from "@/schema/order-schema";

export const POST = auth(async (req, res) => {
    let user, items;
    try {
        user = req.auth!.user;
        items = createOrder.parse(await req.json()).items;
    } catch (error: any) {
        return handleValidationError(error);
    }

    try {
        let url;

        await prisma.$transaction(
            async (tx) => {
                const orderCreated = await tx.order.create({
                    data: {
                        customer: {
                            connect: {
                                id: user.id,
                            },
                        },
                        consumptions: {
                            createMany: {
                                data: items.map((item) => ({
                                    productId: item.id,
                                    quantity: item.quantity,
                                })),
                                skipDuplicates: true,
                            },
                        },
                        products: {
                            createMany: {
                                data: items.map((item) => ({
                                    productId: item.id,
                                    quantity: item.quantity,
                                })),
                                skipDuplicates: true,
                            },
                        },
                    },
                });

                const session = await Stripe.createCheckoutSession(user, orderCreated, tx);

                await tx.order.update({
                    where: { id: orderCreated.id },
                    data: {
                        Transaction: {
                            create: {
                                amount: session.amount,
                                status: "PENDING",
                                checkoutSessionId: session.sessionId,
                            },
                        },
                    },
                });

                url = session.url;
            },
            { timeout: 20000 },
        );

        return Response.json({ url });
    } catch (error: any) {
        console.log(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});
