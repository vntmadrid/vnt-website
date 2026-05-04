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

type DeliveryMethod = "shipping" | "pickup";

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
            deliveryMethod,
        }: {
            items: CheckoutCartItem[];
            lang?: string;
            deliveryMethod?: DeliveryMethod;
        } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { message: "Cart is empty" },
                { status: 400 },
            );
        }

        const method: DeliveryMethod =
            deliveryMethod === "pickup" ? "pickup" : "shipping";
        const safeLang = lang || "en";

        // Fetch up-to-date products from Sanity to prevent price tampering
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

        const productById = new Map(
            sanityProducts.map((product) => [product._id, product]),
        );

        // Validate prices and stock
        for (const item of items) {
            const sanityProduct = productById.get(item.id);

            if (!sanityProduct) {
                return NextResponse.json(
                    { message: `Product ${item.id} not found` },
                    { status: 404 },
                );
            }

            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                return NextResponse.json(
                    { message: `Invalid quantity for ${item.id}` },
                    { status: 400 },
                );
            }

            if (sanityProduct.stock < item.quantity) {
                return NextResponse.json(
                    {
                        message: `Insufficient stock for ${sanityProduct.title?.en || item.id}`,
                    },
                    { status: 400 },
                );
            }
        }

        const host =
            process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : "http://localhost:3000");

        const lineItems: any[] = items.map((item) => {
            const product = productById.get(item.id)!;

            // If we have a Pre-created Stripe Price ID in Sanity schema
            if (product.stripePriceId) {
                return {
                    price: product.stripePriceId,
                    quantity: item.quantity,
                };
            }

            // Fallback: Dynamically generate price data if no ID provided in Sanity CMS
            const imageUrl = item.image ? urlFor(item.image).url() : undefined;
            const title =
                product.title?.[safeLang] || product.title?.en || "VNT Product";

            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: title,
                        images: imageUrl ? [imageUrl] : undefined,
                    },
                    unit_amount: Math.round(product.price * 100), // Stripe expects cents
                },
                quantity: item.quantity,
            };
        });

        // Configure shipping options
        let shippingOptions: any[] | undefined;
        let shippingAddressCollection: any | undefined;

        if (method === "shipping") {
            // if need to restrict delivery location, include/remove the countries here
            shippingAddressCollection = {
                allowed_countries: [
                    "AD",
                    "AL",
                    "AT",
                    "BA",
                    "BE",
                    "BG",
                    "CH",
                    "CY",
                    "CZ",
                    "DE",
                    "DK",
                    "EE",
                    "ES",
                    "FI",
                    "FR",
                    "GB",
                    "GI",
                    "GR",
                    "HR",
                    "HU",
                    "IE",
                    "IS",
                    "IT",
                    "LI",
                    "LT",
                    "LU",
                    "LV",
                    "MC",
                    "MD",
                    "ME",
                    "MK",
                    "MT",
                    "NL",
                    "NO",
                    "PL",
                    "PT",
                    "RO",
                    "RS",
                    "SE",
                    "SI",
                    "SK",
                    "SM",
                    "TR",
                    "UA",
                    "VA",
                ],
            };

            // If you configure Shipping Rates in Stripe Dashboard,
            // pass them via environment variables e.g. STRIPE_SHIPPING_RATE_ID
            if (process.env.STRIPE_SHIPPING_RATE_ID) {
                shippingOptions = [
                    { shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID },
                ];
            }
        }

        // Keep metadata compact: p contains "productId:qty,productId:qty"
        const compactPurchase = items
            .map((i) => `${i.id}:${i.quantity}`)
            .join(",");

        const metadata = {
            p: compactPurchase,
            dm: method,
        };

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${host}/${safeLang}/shop?success=true`,
            cancel_url: `${host}/${safeLang}/shop?canceled=true`,
            shipping_address_collection: shippingAddressCollection,
            shipping_options: shippingOptions,
            metadata,
        });

        if (!session.id) {
            throw new Error("Could not create Stripe session");
        }

        return NextResponse.json(
            {
                sessionId: session.id,
                url: session.url,
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 },
        );
    }
}
