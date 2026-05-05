import { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";

export async function generateMetadata(props: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const lang = params.lang;
    const isEs = lang === "es";

    return {
        title: isEs ? "Tienda | VNT Madrid" : "Shop | VNT Madrid",
        description: isEs 
            ? "Compra nuestra selección de productos exclusivos en VNT Madrid." 
            : "Shop our curated selection of exclusive products at VNT Madrid.",
    };
}

import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import CartDrawer from "@/components/shop/CartDrawer";
import { SanityLive } from "@/sanity/lib/live";

// GROQ query to fetch all products and find the event that references them
const PRODUCTS_QUERY = `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    description,
    slug,
    price,
    stock,
    images,
    image,
    "event": *[_type == "event" && references(^._id)][0]{
      _id,
      title
    }
  }
`;

export default async function ShopPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const resolvedParams = await params;
    const { lang } = resolvedParams;

    const { data: products } = await sanityFetch({ query: PRODUCTS_QUERY });

    return (
        <div className="bg-black min-h-screen text-white flex flex-col font-sans">
            <CartDrawer lang={lang} />
            <ShopHeader lang={lang} />

            <main className="flex-1 w-full max-w-screen-2xl mx-auto xl:px-8">
                <ProductGrid products={products} lang={lang} />
            </main>
            <SanityLive />
        </div>
    );
}
