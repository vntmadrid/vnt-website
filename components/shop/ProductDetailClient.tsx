"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { urlFor } from "@/sanity/lib/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";

interface ProductDetailProps {
    product: any;
    lang: string;
}

function ShopInfoBlock({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col border-t border-white/20 pt-4">
            <p className="text-white/60 tracking-wider text-xs lg:text-sm font-medium uppercase mb-1">
                {label}
            </p>
            <div className="text-white w-full">{children}</div>
        </div>
    );
}

export default function ProductDetailClient({
    product,
    lang,
}: ProductDetailProps) {
    const { addItem, openCart } = useCartStore();
    const title = product.title[lang] || product.title.en;
    const description = product.description
        ? product.description[lang] || product.description.en
        : null;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = product.images || [];
    const hasMultipleImages = images.length > 1;

    const handleNextImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const handlePrevImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex(
                (prev) => (prev - 1 + images.length) % images.length,
            );
        }
    };

    

    // Right details section logic requires translations
    const priceLabel = lang === "es" ? "PRECIO" : "PRICE";
    const stockLabel = lang === "es" ? "DISPONIBILIDAD" : "AVAILABILITY";
    const eventLabel =
        lang === "es" ? "EVENTO DE ESTE PRODUCTO" : "ASSOCIATED EVENT";
    const descriptionLabel = lang === "es" ? "DESCRIPCIÓN" : "DESCRIPTION";

    const isSoldOut = product.stock <= 0;
    const stockText = isSoldOut
        ? lang === "es"
            ? "Agotado"
            : "Sold Out"
        : product.stock <= 5
          ? `${lang === "es" ? "Solo quedan" : "Only"} ${product.stock}`
          : lang === "es"
            ? "En stock"
            : "In Stock";

    const handleAddToCart = () => {
        addItem({
            id: product._id,
            title: product.title,
            slug: product.slug.current,
            price: product.price,
            stock: product.stock,
            image: images[0],
            stripePriceId: product.stripePriceId,
        });
        openCart(); // Show cart after adding
    };

    const currentImage = images[currentImageIndex];
    const currentImageUrl = currentImage
        ? urlFor(currentImage).width(1200).height(1500).url()
        : null;

    return (
        <div className="flex flex-col justify-center lg:flex-row gap-8 lg:gap-12 w-full p-6 pb-24">
            {/* Left Column: Big Image & Carousel styling */}
            <div className="w-full lg:w-[40%] flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] bg-white/5 overflow-hidden  group">
                    {currentImageUrl && (
                        <Image
                            src={currentImageUrl}
                            alt={title}
                            fill
                            sizes="(min-width: 1024px) 40vw, 90vw"
                            className="object-cover transition-opacity duration-300"
                            priority
                        />
                    )}
                </div>

                {/* Carousel buttons to match EventsCarousel style (visual layout) */}
                {/* <div className="flex w-full mt-6 flex-row gap-2 justify-center lg:justify-between items-center text-sm lg:text-base border-t border-white/20 pt-6">
                    <div className="flex-1 flex justify-start">
                        <button
                            onClick={handlePrevImage}
                            disabled={!hasMultipleImages}
                            className="flex items-center justify-center p-3 sm:px-6 sm:py-3 lg:px-8 lg:py-6 border border-white/50 rounded-full hover:bg-white hover:text-black transition-colors w-12 h-12 sm:w-auto sm:h-auto uppercase disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                        >
                            <ChevronLeftIcon />
                            <span className="hidden sm:block ml-2 uppercase">
                                PREV
                            </span>
                        </button>
                    </div>

                    <div className="flex-[2] flex justify-center uppercase font-medium text-white/60 tracking-wider">
                        {images.length > 0 ? currentImageIndex + 1 : 0} /{" "}
                        {images.length || 0}
                    </div>

                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={handleNextImage}
                            disabled={!hasMultipleImages}
                            className="flex items-center justify-center p-3 sm:px-6 sm:py-3 lg:px-8 lg:py-6 border border-white/50 rounded-full hover:bg-white hover:text-black transition-colors w-12 h-12 sm:w-auto sm:h-auto uppercase disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                        >
                            <span className="hidden sm:block mr-2 uppercase">
                                NEXT
                            </span>
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div> */}

                <div className="mt-3 w-full flex items-center justify-between gap-3 ">
                    <button
                        type="button"
                        aria-label="Scroll events left"
                        onClick={handlePrevImage}
                        disabled={!hasMultipleImages}
                        className="h-14 w-14 rounded-none bg-white text-black flex items-center justify-center shadow-[0_4px_18px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div
                        className={`h-14 overflow-hidden rounded-none border border-zinc-700 text-zinc-200 text-xs uppercase tracking-wider transition-all duration-500 flex items-center  px-4 opacity-100"`}
                    >
                        {images.length > 0 ? currentImageIndex + 1 : 0} /{" "}
                        {images.length || 0}
                    </div>
                    <button
                        type="button"
                        aria-label="Scroll events right"
                        onClick={handleNextImage}
                        disabled={!hasMultipleImages}
                        className="h-14 w-14 rounded-none bg-white text-black flex items-center justify-center shadow-[0_4px_18px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="w-full lg:w-[40%] flex flex-col gap-6 mt-4 lg:mt-0 sticky top-12 self-start">
                <h1 className="text-4xl lg:text-5xl font-semibold uppercase tracking-tighter mb-4 leading-none">
                    {title}
                </h1>

                {/* Info Blocks mimicking the Event Sidebar */}
                <div className="flex flex-col gap-4">
                    <ShopInfoBlock label={priceLabel}>
                        <p className="text-xl">€{product.price.toFixed(2)}</p>
                    </ShopInfoBlock>

                    {description && (
                        <ShopInfoBlock
                            label={
                                lang === "es" ? "descripción" : "Description"
                            }
                        >
                            <p className="text-white/80 whitespace-pre-wrap">
                                {description}
                            </p>
                        </ShopInfoBlock>
                    )}

                    <ShopInfoBlock label={stockLabel}>
                        <p
                            className={`text-xl flex items-center gap-2 ${isSoldOut ? "text-red-400" : "text-white"}`}
                        >
                            <span
                                className={`w-2 h-2 rounded-full ${isSoldOut ? "bg-red-400" : product.stock <= 5 ? "bg-yellow-400" : "bg-green-400"}`}
                            />
                            {stockText}
                        </p>
                    </ShopInfoBlock>

                    {product.event && (
                        <ShopInfoBlock label={eventLabel}>
                            <Link
                                href={`/${lang}/events/${product.event.slug.current}`}
                                className="group flex flex-row items-center justify-between font-medium text-lg border-b border-white/10 pb-2 hover:border-white/40 transition-colors pt-2"
                            >
                                <p className="group-hover:text-white/80 transition-colors uppercase">
                                    {product.event.title[lang] ||
                                        product.event.title.en}
                                </p>
                                <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                            </Link>
                        </ShopInfoBlock>
                    )}
                </div>

                {/* Add to Cart CTA */}
                <div className="">
                    <button
                        onClick={handleAddToCart}
                        disabled={isSoldOut}
                        className={`w-full py-3 px-5 font-medium tracking-tighter uppercase transition-colors flex items-center justify-center text-xl shadow-lg
              ${
                  isSoldOut
                      ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                      : "bg-white text-black hover:bg-white/90 shadow-white/10 hover:scale-[1.01] active:scale-95"
              }`}
                    >
                        {isSoldOut
                            ? lang === "es"
                                ? "AGOTADO"
                                : "SOLD OUT"
                            : lang === "es"
                              ? "AÑADIR AL CARRITO"
                              : "ADD TO CART"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ChevronLeftIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
