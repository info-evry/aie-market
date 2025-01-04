import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const GET = auth(async (req, res) => {
    const id = req.url.split("/").pop();

    try {
        const order = await prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                consumptions: {
                    include: {
                        product: true,
                    },
                },
                products: true,
            },
        });

        if (!order) {
            return Response.json({ message: "Order not found" }, { status: 404 });
        }

        return Response.json(order, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Error on database query" }, { status: 500 });
    }
});
