"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface Product {
    _id: string;
    title: Record<string, string>;
    slug: { current: string };
    price: number;
    stock: number;
    images: any[];
    event?: {
        _id: string;
        title: Record<string, string>;
    };
}

interface ProductGridProps {
    products: Product[];
    lang: string;
}

export default function ProductGrid({ products, lang }: ProductGridProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<
        "newest" | "price_asc" | "price_desc"
    >("newest");
    const [groupByEvent, setGroupByEvent] = useState(false);

    const filteredAndSortedProducts = useMemo(() => {
        // Filter
        let result = products.filter((p) => {
            const title = (p.title[lang] || p.title.en || "").toLowerCase();
            return title.includes(searchTerm.toLowerCase());
        });

        // Sort
        if (sortOption === "price_asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price_desc") {
            result.sort((a, b) => b.price - a.price);
        }
        // "newest" is default from GROQ query order (_createdAt desc)
        // If we wanted to enforce newest strictly we'd need _createdAt in the payload,
        // but preserving the initial payload array order is generally fine for "newest" unless re-sorted.

        return result;
    }, [products, lang, searchTerm, sortOption]);

    const groupedProducts = useMemo(() => {
        if (!groupByEvent) return null;

        const groups: Record<string, { eventTitle: string; items: Product[] }> =
            {
                none: {
                    eventTitle: lang === "es" ? "Colección General" : "General Collection",
                    items: [],
                },
            };

        filteredAndSortedProducts.forEach((p) => {
            if (p.event) {
                if (!groups[p.event._id]) {
                    groups[p.event._id] = {
                        eventTitle:
                            p.event.title[lang] || p.event.title.en || "Event",
                        items: [],
                    };
                }
                groups[p.event._id].items.push(p);
            } else {
                groups.none.items.push(p);
            }
        });

        return Object.values(groups).filter((g) => g.items.length > 0);
    }, [filteredAndSortedProducts, groupByEvent, lang]);

    const renderGrid = (items: Product[]) => (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            <AnimatePresence>
                {items.map((product, index) => {
                    const title = product.title[lang] || product.title.en;
                    const isSoldOut = product.stock <= 0;
                    console.log("products in shop grid:", product)

                    return (
                        <motion.div
                            layout
                            key={product._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                href={`/${lang}/shop/${product.slug.current}`}
                                className="group block relative"
                            >
                                {/* Image Container */}
                                <div
                                    className={`relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-white/5 border border-white/10 transition-colors group-hover:border-white/30 ${isSoldOut ? "grayscale opacity-75" : ""}`}
                                >
                                    {product.images && product.images[0] && (
                                        <Image
                                            src={urlFor(product.images[0])
                                                .width(600)
                                                .height(800)
                                                .url()}
                                            alt={title}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    )}

                                    {/* Sold Out Overlay */}
                                    {isSoldOut && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="bg-black/80 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wider backdrop-blur-sm border border-white/10 ">
                                                {lang === "es"
                                                    ? "Agotado"
                                                    : "Sold Out"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="mt-4 flex flex-col items-center text-center space-y-1">
                                    <h3 className="text-white font-medium tracking-tight group-hover:text-white/80 transition-colors uppercase text-sm">
                                        {title}
                                    </h3>
                                    <p className="text-white/60 font-light text-sm">
                                        €{product.price.toFixed(2)}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="flex flex-col w-full">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-6 border-b border-white/20 mb-2 mt-4 bg-white/[0.02]">
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                    <input
                        type="text"
                        placeholder={lang === "es" ? "Buscar..." : "Search..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 py-2 pl-10 pr-4 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
                    />
                </div>

                {/* Filters & Toggles */}
                <div className="flex flex-row items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {/* Group Toggle */}
                    <label className="flex items-center gap-3 text-sm text-white/90 cursor-pointer whitespace-nowrap hidden sm:flex hover:text-white transition-colors">
                        <input
                            type="checkbox"
                            checked={groupByEvent}
                            onChange={(e) => setGroupByEvent(e.target.checked)}
                            className="rounded border-white/30 bg-white/10 accent-white w-4 h-4 cursor-pointer"
                        />
                        {lang === "es"
                            ? "Agrupar por evento"
                            : "Group by event"}
                    </label>

                    <button
                        onClick={() => setGroupByEvent(!groupByEvent)}
                        className={`sm:hidden px-4 py-2 border text-xs font-bold uppercase transition-colors whitespace-nowrap ${
                            groupByEvent
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-white/90 border-white/30 hover:bg-white/10"
                        }`}
                    >
                        {lang === "es" ? "Agrupar" : "Group"}
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={(e) =>
                                setSortOption(e.target.value as any)
                            }
                            className="bg-white/10 border border-white/20 text-white text-sm py-2 px-2.5 pr-12 focus:outline-none focus:border-white/40 appearance-none min-w-[140px] uppercase font-semibold tracking-wide cursor-pointer hover:bg-white/15 transition-colors"
                        >
                            <option
                                value="newest"
                                className="bg-zinc-900 text-white"
                            >
                                {lang === "es" ? "Más nuevos" : "Newest"}
                            </option>
                            <option
                                value="price_asc"
                                className="bg-zinc-900 text-white"
                            >
                                {lang === "es"
                                    ? "Menor precio"
                                    : "Lowest Price"}
                            </option>
                            <option
                                value="price_desc"
                                className="bg-zinc-900 text-white"
                            >
                                {lang === "es"
                                    ? "Mayor precio"
                                    : "Highest Price"}
                            </option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-[10px]">
                            ▼
                        </div>
                    </div>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col flex-1 items-center justify-center p-6 text-center text-white min-h-[50vh]">
                    <h2 className="text-2xl font-light tracking-tighter uppercase mb-4">
                        {lang === "es"
                            ? "No hay productos disponibles"
                            : "No products available"}
                    </h2>
                    <p className="text-white/60">
                        {lang === "es"
                            ? "Vuelve más tarde para ver novedades."
                            : "Check back later for new arrivals."}
                    </p>
                </div>
            ) : filteredAndSortedProducts.length === 0 ? (
                <div className="flex flex-col flex-1 items-center justify-center p-12 text-center text-white min-h-[40vh]">
                    <p className="text-white/60">
                        {lang === "es"
                            ? "No se encontraron productos con esa búsqueda."
                            : "No products match your search."}
                    </p>
                </div>
            ) : (
                <>
                    {groupByEvent && groupedProducts ? (
                        <div className="flex flex-col gap-8 pb-12">
                            {groupedProducts.map((group) => (
                                <div
                                    key={group.eventTitle}
                                    className="flex flex-col"
                                >
                                    <h2 className="px-6 pt-4 text-xl md:text-2xl font-medium tracking-tighter uppercase text-white/50 border-b border-white/10 pb-4">
                                        {group.eventTitle}
                                    </h2>
                                    {renderGrid(group.items)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="pb-12">
                            {renderGrid(filteredAndSortedProducts)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
