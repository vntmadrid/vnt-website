import { client } from "@/sanity/lib/client";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import CartDrawer from "@/components/shop/CartDrawer";

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

    const products = await client.fetch(PRODUCTS_QUERY);

    return (
        <div className="bg-black min-h-screen text-white flex flex-col font-sans">
            <CartDrawer lang={lang} />
            <ShopHeader lang={lang} />

            <main className="flex-1 w-full max-w-screen-2xl mx-auto xl:px-8">
                <ProductGrid products={products} lang={lang} />
            </main>
        </div>
    );
}
