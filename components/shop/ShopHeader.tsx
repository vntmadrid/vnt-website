"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import VNTlogo from "@/public/VNT black logo.svg";
import { useCartStore } from "@/lib/store/useCartStore";

interface ShopHeaderProps {
    lang: string;
    isDetailPage?: boolean;
}

export default function ShopHeader({
    lang,
    isDetailPage = false,
}: ShopHeaderProps) {
    const [isExiting, setIsExiting] = useState(false);
    const { openCart, getItemCount } = useCartStore();
    const pastEventsText = lang === "es" ? "TIENDA" : "SHOP";
    
    // Add hydration safety for item count
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const handleBackClick = () => {
        setIsExiting(true);
    };

    return (
        <div className="flex flex-row justify-between items-center p-6">
            <Link href={`/${lang}`}>
                <Image
                    src={VNTlogo}
                    alt={"VntLogo"}
                    className="brightness-0 invert w-fit h-14 lg:h-16"
                />
            </Link>

            <div className="flex items-center gap-6">
                {isDetailPage ? (
                    <Link
                        href={`/${lang}/shop`}
                        onClick={handleBackClick}
                        className="text-2xl lg:text-3xl font-semibold text-white hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <AnimatePresence>
                            {!isExiting && (
                                <motion.div
                                    key="back-arrow"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0, 0.16, 0.096, 0.987],
                                    }}
                                >
                                    <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {pastEventsText}
                    </Link>
                ) : (
                    <p className="text-2xl lg:text-3xl font-semibold text-white">
                        {pastEventsText}
                    </p>
                )}

                <button 
                  onClick={openCart}
                  className="relative p-2 text-white hover:text-white/80 transition-colors bg-white/5 rounded-full border border-white/10"
                >
                    <ShoppingBag size={24} />
                    {mounted && getItemCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {getItemCount()}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
