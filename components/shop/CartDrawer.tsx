"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { ShoppingBag, X, Plus, Minus, Loader2 } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { loadStripe } from "@stripe/stripe-js";
import { useShippingRates } from "@/lib/hooks/useShippingRates";

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
    const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping");

    const [checkoutStep, setCheckoutStep] = useState<"cart" | "address">("cart");
    const {
        address,
        setAddress,
        shippingRates,
        selectedRate,
        setSelectedRate,
        isFetchingRates,
        fetchError,
        fetchRates,
        resetRates
    } = useShippingRates();

    // Reset shipping options and go back to cart view if the cart contents change
    const cartContentsKey = JSON.stringify(items.map(i => ({ id: i.id, q: i.quantity })));
    useEffect(() => {
        setCheckoutStep("cart");
        resetRates();
    }, [cartContentsKey]); // Intentionally leaving out resetRates from deps to avoid infinite loops if hook re-renders

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
        if (!mounted) return;

        const successParam = searchParams.get("success") === "true";

        // Only clear cart on successful payment, not on cancellation
        if (successParam) {
            clearCart();
            closeCart();
            // Clear the localStorage flag
            localStorage.removeItem("checkout_session_id");
            
            // Remove the success param from URL without refreshing
            const params = new URLSearchParams(searchParams.toString());
            params.delete("success");
            const newUrl = params.toString()
                ? `?${params.toString()}`
                : window.location.pathname;
            router.replace(newUrl, { scroll: false });
        }
    }, [mounted, searchParams, clearCart, closeCart, router]);

    if (!mounted) return null;

    const handleCheckoutInit = () => {
        if (deliveryMethod === "pickup") {
            handleCheckout();
        } else {
            setCheckoutStep("address");
        }
    };

    const handleFetchRates = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetchRates(items);
    };

    const handleCheckout = async () => {
        try {
            setIsCheckingOut(true);
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    items, 
                    lang, 
                    deliveryMethod,
                    shippoRate: selectedRate,
                    customerEmail: address.email,
                    address
                }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Checkout failed");

            if (data.url) {
                // Set a flag in localStorage to track checkout completion
                localStorage.setItem("checkout_session_id", data.sessionId || "pending");
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
                                {checkoutStep === "cart" ? t.title : (lang === "es" ? "DIRECCIÓN DE ENVÍO" : "SHIPPING ADDRESS")}
                            </h2>
                            <button
                                onClick={() => {
                                    if (checkoutStep === "address") setCheckoutStep("cart");
                                    else closeCart();
                                }}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                aria-label={checkoutStep === "address" ? "Back to Cart" : "Close Cart"}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {checkoutStep === "cart" ? (
                            <>
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
                                    onClick={handleCheckoutInit}
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
                            </>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                                <form onSubmit={handleFetchRates} className="space-y-4">
                                    <div className="space-y-2">
                                        <input required placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors" />
                                        <input required type="email" placeholder="Email" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors" />
                                        <input required type="tel" placeholder="Phone" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors" />
                                        <input required placeholder="Street Address" value={address.street1} onChange={e => setAddress({...address, street1: e.target.value})} className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors" />
                                        <div className="flex gap-2">
                                            <input required placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="flex-1 bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors" />
                                            <input placeholder="State (Optional)" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-24 bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors" />
                                        </div>
                                        <div className="flex gap-2">
                                            <input required placeholder="ZIP Code" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} className="w-24 bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors" />
                                            <input required placeholder="Country (e.g. ES, US)" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="flex-1 bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors" />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isFetchingRates} className="w-full py-3 bg-white/10 text-white rounded-md text-sm font-medium tracking-tighter uppercase hover:bg-white/20 transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                                        {isFetchingRates ? <><Loader2 size={16} className="animate-spin" /> {lang === 'es' ? 'Calculando...' : 'Calculating...'}</> : (lang === 'es' ? 'Calcular Envío' : 'Calculate Shipping')}
                                    </button>
                                </form>

                                {fetchError === "no_rates" && shippingRates.length === 0 && (
                                    <div className="mt-8 p-4 bg-white/5 border border-white/20 rounded-lg text-sm text-center">
                                        <p className="text-white/80 mb-2">
                                            {lang === 'es' 
                                                ? 'No se pudieron calcular las tarifas de envío para esta dirección automáticamente. Por favor, contáctanos antes de comprar.'
                                                : 'We could not automatically calculate shipping to this address. Please contact us before buying.'}
                                        </p>
                                        <a href="mailto:vnt.madrid@gmail.com" className="text-white underline hover:text-white/80 font-medium">vnt.madrid@gmail.com</a>
                                    </div>
                                )}

                                {shippingRates.length > 0 && (
                                    <div className="mt-8 space-y-6">
                                        {Object.entries(
                                            shippingRates.reduce((acc, rate) => {
                                                const providerName = rate.provider;
                                                if (!acc[providerName]) acc[providerName] = { 
                                                    rates: [], 
                                                    image: rate.providerImage75 
                                                };
                                                acc[providerName].rates.push(rate);
                                                return acc;
                                            }, {} as Record<string, { rates: any[], image: string }>)
                                        ).map(([providerName, group]: [string, any]) => (
                                            <div key={providerName} className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    {group.image && (
                                                        <div className="bg-white rounded p-1 w-10 h-10 flex items-center justify-center shrink-0">
                                                            {/* Empty string as fallback to trigger onError handler or just skip Next/Image to avoid domain whitelist issues */}
                                                            <img 
                                                                src={group.image} 
                                                                alt={providerName} 
                                                                className="max-w-full max-h-full object-contain" 
                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                            />
                                                        </div>
                                                    )}
                                                    <h4 className="font-semibold text-white/90 text-sm tracking-wide uppercase">
                                                        {providerName}
                                                    </h4>
                                                </div>
                                                <div className="space-y-2">
                                                    {group.rates.map((rate: any) => (
                                                        <label 
                                                            key={rate.objectId} 
                                                            onClick={() => setSelectedRate(rate)}
                                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedRate?.objectId === rate.objectId ? 'border-white bg-white/5' : 'border-white/20 hover:border-white/40'}`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={`flex-shrink-0 w-4 h-4 rounded-full border flex flex-col items-center justify-center ${selectedRate?.objectId === rate.objectId ? 'border-white' : 'border-white/40'}`}>
                                                                    {selectedRate?.objectId === rate.objectId && <div className="w-2 h-2 bg-white rounded-full" />}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium">{rate.servicelevelName || rate.title.replace(`${providerName} - `, '')}</span>
                                                                    {rate.estimatedDays && (
                                                                        <span className="text-xs text-white/50">
                                                                            {rate.estimatedDays} {lang === 'es' ? 'días estim. / est. days' : 'est. days'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-bold">€{rate.amount}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="mt-auto pt-6">
                                    <div className="flex justify-between items-center mb-6 text-lg tracking-tighter">
                                        <span className="text-white/60">{lang === 'es' ? 'TOTAL' : 'TOTAL'}</span>
                                        <span>€{(getTotal() + (selectedRate ? parseFloat(selectedRate.amount) : 0)).toFixed(2)}</span>
                                    </div>
                                    <button 
                                        onClick={handleCheckout} 
                                        disabled={isCheckingOut || (!selectedRate)} 
                                        className="w-full py-4 bg-white text-black rounded-full font-medium tracking-tighter uppercase hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isCheckingOut ? <><Loader2 size={18} className="animate-spin" /> {t.processing}</> : (lang === 'es' ? 'Ir al Pago' : 'Proceed to Payment')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
