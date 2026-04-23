"use client";

import { motion } from "framer-motion";

const menuData = {
    restaurant_name: "VNT Coffee",
    sections: [
       
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

export default function MenuContent({ menuData }: any) {
    const rawMenuData = {
        restaurant_name: menuData?.menuTitle || "VNT Coffee",
        sections: menuData?.menuSections?.length > 0 ? menuData.menuSections : [
            {
                sectionName: "HOT",
                items: [
                    { name: "Espresso", price: 2.7, currency: "EUR" },
                    { name: "Double Espresso", price: 3.4, currency: "EUR" }
                ]
            }
        ],
        footer: menuData?.menuFooter || "Allergen information is available upon request. Please consult us."
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        },
        exit: { opacity: 0, y: -0, filter: "blur(4px)", transition: { duration: 0.3, ease: "easeIn" as const } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
        show: { 
            opacity: 1, 
            y: 0, 
            filter: "blur(0px)",
            transition: { duration: 0.5, ease: "easeOut" as const }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="pb-0"
        >
            <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-3xl md:text-4xl font-medium tracking-tight uppercase mb-4">
                    {rawMenuData.restaurant_name}
                </h2>
                <div className="w-full h-px bg-black"></div>
            </motion.div>

            <div className="space-y-10">
                {rawMenuData.sections.map((section: any, idx: number) => (
                    <motion.div variants={itemVariants} key={idx} className="space-y-4">
                        <h3 className="text-xl font-medium tracking-wide">
                            {section.sectionName}
                        </h3>
                        <div className="space-y-4">
                            {section.items?.map((item: any, itemIdx: number) => (
                                <div key={itemIdx} className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-base">{item.name}</p>
                                        {('description' in item) && item.description && (
                                            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-base tabular-nums">
                                        €{item.price?.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div variants={itemVariants} className="mt-12 pt-6 border-t border-black">
                <p className="text-xs text-gray-500 uppercase tracking-widest text-center">
                    {rawMenuData.footer}
                </p>
            </motion.div>
        </motion.div>
    );
}