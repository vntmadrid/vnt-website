import { sanityFetch } from "@/sanity/lib/live";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import CartDrawer from "@/components/shop/CartDrawer";
import { notFound } from "next/navigation";
import { SanityLive } from "@/sanity/lib/live";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const { lang, slug } = resolvedParams;

    const query = `*[_type == "product" && slug.current == $slug][0] {
        "title": title[$lang],
        "description": description[$lang]
    }`;
    const product = await client.fetch(query, { slug, lang });

    if (!product) return {};

    return {
        title: `${product.title} | VNT Madrid`,
        description: product.description || "Product details at VNT Madrid",
    };
}

const PRODUCT_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    description,
    slug,
    price,
    stock,
    images,
    image,
    stripePriceId,
    "event": *[_type == "event" && references(^._id)][0]{
      title,
      slug
    }
  }
`;

export default async function ProductPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const resolvedParams = await params;
    const { lang, slug } = resolvedParams;

    const { data: product } = await sanityFetch({ 
        query: PRODUCT_QUERY, 
        params: { slug } 
    });

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-black min-h-screen text-white flex flex-col font-sans">
            <CartDrawer lang={lang} />
            <ShopHeader lang={lang} isDetailPage />

            <main className="flex-1 w-full max-w-screen-2xl mx-auto xl:px-12 mt-8 lg:mt-12">
                <ProductDetailClient product={product} lang={lang} />
            <SanityLive />
            </main>
        </div>
    );
}
