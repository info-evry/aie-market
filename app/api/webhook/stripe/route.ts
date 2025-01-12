import { Stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { default as stripe } from "stripe";

export const POST = async (req: NextRequest) => {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: stripe.Event | null = null;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
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

                if (await Stripe.checkIsProcessed(session)) {
                    return NextResponse.json({ received: true });
                }

                if (await Stripe.handleSessionComplete(session)) {
                    return NextResponse.json({ received: true });
                }

                return NextResponse.json({ error: "Error completing" }, { status: 500 });
            } catch (error) {
                console.error("⚠️ Stripe checkout session completed failed", error);
                return NextResponse.json({ error: "Error in database" }, { status: 500 });
            }
        }
        case "checkout.session.expired": {
            try {
                const session = event.data.object as stripe.Checkout.Session;

                if (await Stripe.checkIsProcessed(session)) {
                    return NextResponse.json({ received: true });
                }

                if (await Stripe.handleSessionExpire(session)) {
                    return NextResponse.json({ received: true });
                }

                return NextResponse.json({ error: "Error expiring" }, { status: 500 });
            } catch (error) {
                console.error("⚠️ Stripe checkout session expired failed", error);
                return NextResponse.json({ error: "Error updating transaction" }, { status: 500 });
            }
        }
        default: {
            console.log("⚠️ Stripe event type not handled", event.type);
            return NextResponse.json({ message: "Stripe event type not handled" }, { status: 200 });
        }
    }
};
