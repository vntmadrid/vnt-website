import { NextResponse } from "next/server";
import Stripe from "stripe";
import { writeClient, client } from "@/sanity/lib/client";
import { sendStaffNotification } from "@/lib/email";

export const runtime = "nodejs";

type PurchasedItem = {
    id: string;
    quantity: number;
};

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY || "sk_test_mock_value",
    {
        apiVersion: "2026-04-22.dahlia" as any,
    },
);

function parseCompactPurchase(value: string | undefined): PurchasedItem[] {
    if (!value) return [];

    return value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const [id, qty] = entry.split(":");
            const quantity = Number.parseInt(qty, 10);
            return { id, quantity };
        })
        .filter(
            (item) =>
                item.id && Number.isInteger(item.quantity) && item.quantity > 0,
        );
}

export async function POST(req: Request) {
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        return NextResponse.json(
            { message: "Missing Stripe webhook signature or secret" },
            { status: 400 },
        );
    }

    const payload = await req.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            webhookSecret,
        );
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Invalid webhook signature";
        return NextResponse.json({ message }, { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
        return NextResponse.json({ received: true }, { status: 200 });
    }

    const session = event.data.object as any;
    const purchasedItems = parseCompactPurchase(session.metadata?.p);

    if (purchasedItems.length === 0) {
        return NextResponse.json(
            { message: "No purchased items metadata found for session" },
            { status: 400 },
        );
    }

    if (!process.env.SANITY_API_TOKEN) {
        return NextResponse.json(
            { message: "Missing SANITY_API_TOKEN for stock update" },
            { status: 500 },
        );
    }

    try {
        const transaction = writeClient.transaction();

        // 1. Decrement Stock
        for (const item of purchasedItems) {
            transaction.patch(item.id, {
                dec: { stock: item.quantity },
            });
        }

        // 2. Create Order Document
        const orderNumber = `ORD-${Date.now()}`;
        const deliveryMethod = session.metadata?.dm || "unknown";

        transaction.create({
            _type: "order",
            orderNumber,
            stripeSessionId: session.id,
            status: "pending",
            customer: {
                name: session.customer_details?.name || "Unknown",
                email: session.customer_details?.email || "Unknown",
            },
            items: purchasedItems.map((item) => ({
                _type: "orderItem",
                _key: crypto.randomUUID(), // Required for array items in Sanity
                product: {
                    _type: "reference",
                    _ref: item.id,
                },
                quantity: item.quantity,
            })),
            totalAmount: session.amount_total || 0,
            currency: session.currency || "eur",
            deliveryMethod,
            shippingAddress: session.shipping_details?.address || session.customer_details?.address
                ? {
                      line1: session.shipping_details?.address?.line1 || session.customer_details?.address?.line1,
                      line2: session.shipping_details?.address?.line2 || session.customer_details?.address?.line2,
                      city: session.shipping_details?.address?.city || session.customer_details?.address?.city,
                      postal_code: session.shipping_details?.address?.postal_code || session.customer_details?.address?.postal_code,
                      country: session.shipping_details?.address?.country || session.customer_details?.address?.country,
                  }
                : undefined,
            createdAt: new Date().toISOString(),
        });

        await transaction.commit();

        // --- ENHANCEMENT: Send Staff Notification ---
        try {
            // Fetch product titles for the email
            const itemIds = purchasedItems.map((i) => i.id);
            const products = await client.fetch(
                `*[_type == "product" && _id in $itemIds] { _id, title }`,
                { itemIds },
            );

            const itemsWithTitles = purchasedItems.map((item) => {
                const product = products.find((p: any) => p._id === item.id);
                const title =
                    product?.title?.en || product?.title?.es || item.id;
                return { title, quantity: item.quantity };
            });

            const shippingAddress = session.shipping_details?.address || session.customer_details?.address
                ? `${session.shipping_details?.address?.line1 || session.customer_details?.address?.line1 || ''}, ${session.shipping_details?.address?.city || session.customer_details?.address?.city || ''}, ${session.shipping_details?.address?.country || session.customer_details?.address?.country || ''}`
                : undefined;

            // Get delivery method from metadata (defaulting if not found)
            const deliveryMethod = session.metadata?.dm || "unknown";

            await sendStaffNotification({
                customerName: session.customer_details?.name || "Unknown",
                customerEmail: session.customer_details?.email || "Unknown",
                total: session.amount_total || 0,
                items: itemsWithTitles,
                deliveryMethod,
                shippingAddress,
            });
        } catch (emailError) {
            console.error("Non-blocking notification error:", emailError);
        }
        // --------------------------------------------

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Stock update failed";
        return NextResponse.json({ message }, { status: 500 });
    }
}
