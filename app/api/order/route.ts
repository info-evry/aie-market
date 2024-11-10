import { auth } from "@/lib/auth";
import { handleValidationError } from "@/lib/error";
import prisma from "@/lib/prisma";
import { Stripe } from "@/lib/stripe";
import { createOrder } from "@/schema/order-schema";

export const POST = auth(async (req, res) => {
    let user, items;
    try {
        user = req.auth!.user;
        items = createOrder.parse(req.body).items;
    } catch (error: any) {
        return handleValidationError(error);
    }

    // Calculate price & create stripe session
    const products = await Promise.all(
        items.map((item) => prisma.product.findUniqueOrThrow({ where: { id: item.id } })),
    );

    await prisma.$transaction(async (prisma) => {
        const orderCreated = await prisma.order.create({
            data: {
                userId: user.id,
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

        const session = await Stripe.createCheckoutSession(user, orderCreated);

        await prisma.order.update({
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

        return Response.json({ url: session.url });
    });
});
