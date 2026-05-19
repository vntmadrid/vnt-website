import { NextResponse } from "next/server";
import Stripe from "stripe";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY || "sk_test_mock_value",
    {
        apiVersion: "2026-04-22.dahlia" as any,
    },
);

type CheckoutCartItem = {
    id: string;
    quantity: number;
    image?: unknown;
};

type SanityProduct = {
    _id: string;
    price: number;
    stock: number;
    stripePriceId?: string;
    title?: Record<string, string>;
    images?: unknown[];
};

export async function POST(req: Request) {
    try {
        const {
            items,
            lang,
            shippoRate, // This is the rate object chosen on your frontend
            customerEmail,
            deliveryMethod,
            address
        }: {
            items: CheckoutCartItem[];
            lang?: string;
            shippoRate?: {
                amount: string;
                title: string;
                objectId: string;
            };
            customerEmail?: string;
            deliveryMethod?: string;
            address?: any;
        } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { message: "Cart is empty" },
                { status: 400 },
            );
        }

        const safeLang = lang || "en";
        const isShipping = deliveryMethod !== "pickup";

        if (isShipping && !shippoRate) {
            return NextResponse.json(
                { message: "Shipping rate is required for shipping orders" },
                { status: 400 },
            );
        }

        // 1. Fetch products from Sanity (Validation only)
        const itemIds = [...new Set(items.map((i) => i.id))];
        const sanityProducts = await client.fetch<SanityProduct[]>(
            `*[_type == "product" && _id in $itemIds] {
                _id,
                price,
                stock,
                stripePriceId,
                title,
                images
            }`,
            { itemIds },
        );

        const productById = new Map(sanityProducts.map((p) => [p._id, p]));

        // 2. Validate inventory against current stock and build line items.
        const unavailableItems: Array<{
            id: string;
            title: string;
            requested: number;
            available: number;
        }> = [];

        const lineItems: any[] = [];

        for (const item of items) {
            const product = productById.get(item.id);
            if (!product) {
                unavailableItems.push({
                    id: item.id,
                    title: item.id,
                    requested: item.quantity,
                    available: 0,
                });
                continue;
            }

            if (product.stock < item.quantity) {
                unavailableItems.push({
                    id: item.id,
                    title:
                        product.title?.[safeLang] || product.title?.en || item.id,
                    requested: item.quantity,
                    available: Math.max(product.stock, 0),
                });
                continue;
            }

            if (product.stripePriceId) {
                lineItems.push({
                    price: product.stripePriceId,
                    quantity: item.quantity,
                });
                continue;
            }

            const imageUrl = item.image ? urlFor(item.image).url() : undefined;
            const title =
                product.title?.[safeLang] || product.title?.en || "VNT Product";

            lineItems.push({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: title,
                        images: imageUrl ? [imageUrl] : undefined,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            });
        }

        if (unavailableItems.length > 0) {
            return NextResponse.json(
                {
                    message: "Some items in your cart are no longer available.",
                    unavailableItems,
                },
                { status: 409 },
            );
        }

        // 3. Configure shipping only for shipped orders.
        const shippingOptions = isShipping && shippoRate
            ? [
                  {
                      shipping_rate_data: {
                          type: "fixed_amount" as const,
                          fixed_amount: {
                              amount: Math.round(
                                  parseFloat(shippoRate.amount) * 100,
                              ),
                              currency: "eur",
                          },
                          display_name: shippoRate.title,
                      },
                  },
              ]
            : undefined;

        const host =
            process.env.NEXT_PUBLIC_APP_URL ||
            `https://${process.env.VERCEL_URL}`;

        // 4. Create Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            ...(isShipping && customerEmail ? { customer_email: customerEmail } : {}),
            success_url: `${host}/${safeLang}/shop?success=true`,
            cancel_url: `${host}/${safeLang}/shop?canceled=true`,
            ...(shippingOptions ? { shipping_options: shippingOptions } : {}),
            metadata: {
                p: items.map((i) => `${i.id}:${i.quantity}`).join(","),
                shippo_id: shippoRate?.objectId || "",
                sr: shippoRate?.objectId || "",                // Webhook looks for sr (shippo rate id)
                dm: deliveryMethod || "shipping",       // Webhook looks for dm (delivery method)
                c_name: address?.name || "",
                a_l1: address?.street1 || "",
                a_city: address?.city || "",
                a_pos: address?.zip || "",
                a_c: address?.country || "",
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
