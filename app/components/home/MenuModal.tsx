"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const menuData = {
    restaurant_name: "VNT Coffee",
    sections: [
        {
            section_name: "VNT SIGNATURE",
            items: [
                {
                    name: "VÉRTIGO",
                    description: "Double Espresso, Fresh Orange Juice & Spice Reduction, Matcha Tonic",
                    price: 8.0,
                    currency: "EUR"
                },
                {
                    name: "NÉBULA",
                    description: "Ceremonial Matcha, Oat Milk, Lavender Honey & Syrup, Vanilla Extract",
                    price: 6.0,
                    currency: "EUR"
                },
                {
                    name: "TRAZA",
                    description: "Ceremonial Hojicha, Almond Milk, Homemade Black Sesame Syrup",
                    price: 6.0,
                    currency: "EUR"
                }
            ]
        },
        {
            section_name: "SPRING EDITION",
            items: [
                {
                    name: "MIST",
                    description: "Ceremonial Matcha Supreme, Elderflower Syrup, Lime Juice, Sparkling Water",
                    price: 8.0,
                    currency: "EUR"
                },
                {
                    name: "ALT",
                    description: "Double Espresso, Pistachio Cream, Fresh Whole Milk, Vanilla Syrup, Hawai'i Salt",
                    price: 6.0,
                    currency: "EUR"
                },
                {
                    name: "DUSK",
                    description: "Double Espresso, Honey, Fresh Whole Milk, Premium Cinnamon, Grated Nutmeg",
                    price: 6.0,
                    currency: "EUR"
                }
            ]
        },
        {
            section_name: "HOT",
            items: [
                {name: "Espresso", price: 2.7, currency: "EUR"},
                {name: "Double Espresso", price: 3.4, currency: "EUR"},
                {name: "Americano", price: 3.4, currency: "EUR"},
                {name: "Cortado", price: 2.9, currency: "EUR"},
                {name: "Café con Leche", price: 3.2, currency: "EUR"},
                {name: "Cappuccino", price: 2.2, currency: "EUR"},
                {name: "Latte", price: 3.6, currency: "EUR"},
                {name: "Flat White", price: 3.8, currency: "EUR"},
                {name: "Matcha Latte", price: 4.2, currency: "EUR"},
                {name: "Hojicha Latte", price: 4.2, currency: "EUR"},
                {name: "Chai Latte", price: 4.2, currency: "EUR"},
                {name: "Chocolate (Tanzania 75%)", price: 4.7, currency: "EUR"},
                {name: "Moka (Tanzania 75%)", price: 5.7, currency: "EUR"},
                {name: "V60", price: 6.0, currency: "EUR"}
            ]
        },
        {
            section_name: "COLD",
            items: [
                {name: "Cacao Cold Brew", price: 3.5, currency: "EUR"},
                {name: "Coffee Cold Brew", price: 5.0, currency: "EUR"},
                {name: "Iced Americano", price: 3.5, currency: "EUR"},
                {name: "Iced Latte", price: 3.8, currency: "EUR"},
                {name: "Iced Matcha Latte", price: 4.5, currency: "EUR"},
                {name: "Iced Hojicha Latte", price: 4.5, currency: "EUR"},
                {name: "Iced Matcha Coconut Water", price: 5.7, currency: "EUR"},
                {name: "Iced Chai Latte", price: 4.5, currency: "EUR"},
                {name: "Espresso Tonic", price: 4.8, currency: "EUR"},
                {name: "Matcha Indian Tonic", price: 5.0, currency: "EUR"},
                {name: "Hojicha Floral Tonic", price: 5.0, currency: "EUR"}
            ]
        },
        {
            section_name: "EXTRA",
            items: [
                {name: "Oat / Almond / Coco / Lactose-Free", price: 0.5, currency: "EUR"},
                {name: "Shot of Coffee", price: 1.0, currency: "EUR"},
                {name: "Decaffeinated Coffee", price: 0.7, currency: "EUR"},
                {name: "Vanilla Extract", price: 0.5, currency: "EUR"},
                {name: "Premium Cinnamon", price: 0.5, currency: "EUR"},
                {name: "Pistachio Cream", price: 1.0, currency: "EUR"}
            ]
        },
        {
            section_name: "WATERS",
            items: [
                {name: "Still Water Ocean52 (No Plastic)", price: 2.5, currency: "EUR"},
                {name: "Sparkling Water Ocean52 (No Plastic)", price: 3.5, currency: "EUR"},
                {name: "Coconut Water 100% Natural (V-Label)", price: 4.0, currency: "EUR"},
                {name: "Match Tonic Waters (Indian / Floral / Mediterranean / Spicy)", price: 4.0, currency: "EUR"}
            ]
        }
    ],
    footer: "Allergen information is available upon request. Please consult us."
};

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[800px] bg-white z-50 overflow-y-auto text-black font-sans shadow-2xl"
                    >
                        <div className="p-6 md:p-12 relative pb-24">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-2xl font-light hover:opacity-50 transition-opacity"
                                aria-label="Close menu"
                            >
                                ✕
                            </button>

                            <div className="mb-12">
                                <h2 className="text-4xl md:text-5xl font-medium tracking-tight uppercase mb-4">
                                    {menuData.restaurant_name}
                                </h2>
                                <div className="w-full h-px bg-black"></div>
                            </div>

                            <div className="space-y-12">
                                {menuData.sections.map((section, idx) => (
                                    <div key={idx} className="space-y-6">
                                        <h3 className="text-2xl font-medium tracking-wide">
                                            {section.section_name}
                                        </h3>
                                        <div className="space-y-6">
                                            {section.items.map((item, itemIdx) => (
                                                <div key={itemIdx} className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-lg font-medium">{item.name}</p>
                                                        {item.description && (
                                                            <p className="text-sm text-gray-600 mt-1 max-w-[90%] leading-relaxed">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-lg tabular-nums">
                                                        {item.price.toFixed(2)}€
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16 pt-8 border-t border-black">
                                <p className="text-sm text-gray-500 uppercase tracking-widest text-center">
                                    {menuData.footer}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
