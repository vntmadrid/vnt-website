import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { Shippo } from "shippo";

const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY;
const shippoClient = new Shippo({
    apiKeyHeader: SHIPPO_API_KEY || "",
});

// Safety constants
const MAX_WEIGHT_PER_BOX = 28; // kg (under 30 to account for packing material)
const MIN_DIM = 15; // cm (minimum size for a shipping label to fit)

type ShippingProduct = {
    _id: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
};

export async function POST(req: Request) {
    try {
        const { address, items } = await req.json();

        if (!address || !items?.length) {
            return NextResponse.json({ message: "Address and items are required" }, { status: 400 });
        }

        // 1. Fetch exact product data from Sanity
        const itemIds = [...new Set(items.map((i: any) => i.id))];
        const sanityProducts = await client.fetch<ShippingProduct[]>(
            `*[_type == "product" && _id in $itemIds] { _id, weight, length, width, height }`,
            { itemIds }
        );
        const productById = new Map(sanityProducts.map((p: any) => [p._id, p]));

        // 2. SMART PACKER LOGIC (Splits weight into multiple parcels)
        const parcels: any[] = [];
        let currentBoxWeight = 0;
        let currentBoxDims = { l: MIN_DIM, w: MIN_DIM, h: 0 };

        const pushBox = () => {
            if (currentBoxWeight > 0) {
                parcels.push({
                    length: currentBoxDims.l.toString(),
                    width: currentBoxDims.w.toString(),
                    height: Math.max(currentBoxDims.h, 5).toString(), // Min 5cm height
                    distanceUnit: "cm",
                    weight: currentBoxWeight.toFixed(2),
                    massUnit: "kg",
                });
            }
        };

        for (const item of items) {
            const p = productById.get(item.id);
            const w = p?.weight || 0.5;
            const l = p?.length || 10;
            const wd = p?.width || 10;
            const h = p?.height || 2;

            for (let i = 0; i < item.quantity; i++) {
                // If adding this item exceeds the 28kg box limit, "seal" the box and start a new one
                if (currentBoxWeight + w > MAX_WEIGHT_PER_BOX) {
                    pushBox();
                    currentBoxWeight = 0;
                    currentBoxDims = { l: MIN_DIM, w: MIN_DIM, h: 0 };
                }

                currentBoxWeight += w;
                currentBoxDims.l = Math.max(currentBoxDims.l, l);
                currentBoxDims.w = Math.max(currentBoxDims.w, wd);
                currentBoxDims.h += h;
            }
        }
        pushBox(); // Finalize the last box

        // 3. Create the Live Shipment
        const shipment = await shippoClient.shipments.create({
            addressFrom: {
                name: "VNT Madrid",
                street1: "Calle del Noviciado, 4",
                city: "Madrid",
                state: "M",
                zip: "28015",
                country: "ES",
            },
            addressTo: {
                name: address.name,
                street1: address.street1,
                city: address.city,
                state: address.state || "",
                zip: address.zip,
                country: address.country,
                email: address.email,
                phone: address.phone,
            },
            parcels: parcels,
            async: false,
        });

        // 4. Filter and format the rates
        const rates = (shipment.rates || []).map((rate: any) => ({
            objectId: rate.objectId,
            amount: rate.amount,
            currency: rate.currency,
            provider: rate.provider,
            estimatedDays: rate.estimatedDays,
            title: `${rate.provider} - ${rate.servicelevel?.name || "Standard"}`,
        }));

        console.log("Shipment;", shipment)

        return NextResponse.json({
            rates,
            messages: shipment.messages || [],
            parcelCount: parcels.length // Useful for debugging on frontend
        });

    } catch (error: any) {
        console.error("Shippo Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}