"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { ShoppingBag, X, Plus, Minus, Loader2 } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe outside component
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CartDrawer({ lang }: { lang: string }) {
    const {
        items,
        isOpen,
        closeCart,
        updateQuantity,
        removeItem,
        getTotal,
        clearCart,
    } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">(
        "shipping",
    );

    const t = {
        title: lang === "es" ? "Tu Carrito" : "Your Cart",
        empty: lang === "es" ? "Tu carrito está vacío." : "Your cart is empty.",
        continue: lang === "es" ? "CONTINUAR COMPRANDO" : "CONTINUE SHOPPING",
        delivery: lang === "es" ? "Método de entrega" : "Delivery Method",
        ship: lang === "es" ? "Envío a domicilio" : "Ship to me",
        pickup: lang === "es" ? "Recogida en Galería" : "Pick up in Gallery",
        subtotal: lang === "es" ? "SUBTOTAL" : "SUBTOTAL",
        checkout: lang === "es" ? "FINALIZAR COMPRA" : "CHECKOUT",
        processing: lang === "es" ? "PROCESANDO..." : "PROCESSING...",
        footerNote: lang === "es" 
            ? "Envío e impuestos calculados al finalizar la compra." 
            : "Shipping & taxes calculated at checkout."
    };

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && searchParams.get("success") === "true") {
            clearCart();
            // Remove the success param from URL without refreshing
            const params = new URLSearchParams(searchParams.toString());
            params.delete("success");
            const newUrl = params.toString()
                ? `?${params.toString()}`
                : window.location.pathname;
            router.replace(newUrl, { scroll: false });
        }
    }, [mounted, searchParams, clearCart, router]);

    if (!mounted) return null;

    const handleCheckout = async () => {
        try {
            setIsCheckingOut(true);
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, lang, deliveryMethod }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Checkout failed");

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL returned from Stripe");
            }
        } catch (err) {
            console.error(err);
            alert("Checkout failed! Please try again later.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed top-0 right-0 h-full w-full sm:w-100 bg-[#1a1a1a] text-white z-50 flex flex-col border-l border-white/10 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl tracking-tighter uppercase font-light">
                                {t.title}
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Close Cart"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/50 space-y-4">
                                    <ShoppingBag size={48} strokeWidth={1} />
                                    <p>{t.empty}</p>
                                    <button
                                        onClick={closeCart}
                                        className="px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors mt-4 text-sm"
                                    >
                                        {t.continue}
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const imageUrl = item.image
                                        ? urlFor(item.image)
                                              .width(160)
                                              .height(200)
                                              .url()
                                        : null;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex gap-4"
                                        >
                                            {/* Image */}
                                            <div className="relative w-20 h-24 bg-white/5 rounded overflow-hidden shrink-0">
                                                {imageUrl && (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={
                                                            item.title[lang] ||
                                                            item.title.en
                                                        }
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-sm line-clamp-2">
                                                            {item.title[lang] ||
                                                                item.title.en}
                                                        </h3>
                                                        <p className="text-white/60 text-xs mt-1">
                                                            €{item.price}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                        className="text-white/40 hover:text-white transition-colors p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>

                                                {/* Quantity / Subtotal */}
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-3 bg-white/5 rounded-full px-2 py-1 border border-white/10 text-sm">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity -
                                                                        1,
                                                                )
                                                            }
                                                            className="p-1 hover:text-white text-white/50 transition-colors"
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="w-4 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                            className="p-1 hover:text-white text-white/50 transition-colors"
                                                            disabled={
                                                                item.quantity >=
                                                                item.stock
                                                            }
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                    <div className="text-sm font-medium">
                                                        €
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-[#141414]">
                                {/* Delivery Method Selection */}
                                <div className="mb-6 space-y-3">
                                    <span className="text-white/60 text-sm tracking-tighter uppercase font-medium">
                                        {t.delivery}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setDeliveryMethod("shipping")
                                            }
                                            className={`flex-1 py-3 text-sm rounded-lg border transition-colors ${
                                                deliveryMethod === "shipping"
                                                    ? "bg-white text-black border-white"
                                                    : "bg-transparent text-white/60 border-white/20 hover:border-white/50"
                                            }`}
                                        >
                                            {t.ship}
                                        </button>
                                        <button
                                            onClick={() =>
                                                setDeliveryMethod("pickup")
                                            }
                                            className={`flex-1 py-3 text-sm rounded-lg border transition-colors ${
                                                deliveryMethod === "pickup"
                                                    ? "bg-white text-black border-white"
                                                    : "bg-transparent text-white/60 border-white/20 hover:border-white/50"
                                            }`}
                                        >
                                            {t.pickup}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-6 text-lg tracking-tighter">
                                    <span className="text-white/60">
                                        {t.subtotal}
                                    </span>
                                    <span>€{getTotal().toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full py-4 bg-white text-black rounded-full font-medium tracking-tighter uppercase hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                            {t.processing}
                                        </>
                                    ) : (
                                        t.checkout
                                    )}
                                </button>
                                <p className="text-center text-white/40 text-xs mt-4">
                                    {t.footerNote}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
