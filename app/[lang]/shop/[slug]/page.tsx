import { client } from "@/sanity/lib/client";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import CartDrawer from "@/components/shop/CartDrawer";
import { notFound } from "next/navigation";

export const revalidate = 60; // revalidate every minute to keep stock fresh

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

    const product = await client.fetch(PRODUCT_QUERY, { slug });

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-black min-h-screen text-white flex flex-col font-sans">
            <CartDrawer lang={lang} />
            <ShopHeader lang={lang} isDetailPage />

            <main className="flex-1 w-full max-w-screen-2xl mx-auto xl:px-12 mt-8 lg:mt-12">
                <ProductDetailClient product={product} lang={lang} />
            </main>
        </div>
    );
}
