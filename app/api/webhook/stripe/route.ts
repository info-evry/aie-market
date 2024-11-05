import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { default as stripe } from "stripe";

export const POST = async (req: any) => {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: stripe.Event | null = null;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig ?? "",
            process.env.STRIPE_WEBHOOK_SECRET ?? "",
        );
    } catch (err: any) {
        console.log("⚠️ Stripe construct event failed", err.message);
        return NextResponse.json({ error: "Stripe construct event failed" }, { status: 500 });
    }

    switch (event.type) {
        case "checkout.session.completed": {
            try {
                const session = event.data.object as stripe.Checkout.Session;

                return NextResponse.json({ received: true });
            } catch (error) {
                console.log("⚠️ Stripe checkout session completed failed", error);
                return NextResponse.json({ error: "Error updating transaction" }, { status: 500 });
            }
        }
        case "checkout.session.expired": {
            const session = event.data.object as stripe.Checkout.Session;

            try {
                return NextResponse.json({ received: true });
            } catch (error) {
                console.log("⚠️ Stripe checkout session expired failed", error);
                return NextResponse.json({ error: "Error updating transaction" }, { status: 500 });
            }
        }
        default: {
            console.log("⚠️ Stripe event type not handled", event.type);
            return NextResponse.json({ message: "Stripe event type not handled" }, { status: 200 });
        }
    }
};
