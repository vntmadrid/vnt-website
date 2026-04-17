"use client";

import { useRef, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
    useMotionValueEvent,
} from "framer-motion";

import MenuContent from "./MenuContent";
import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";
import CoffeeGalleryBg from "@/public/images/CoffeeGalleryBg.png";

export default function CafeStoryScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showCoffeeContent, setShowCoffeeContent] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuScrollable, setMenuScrollable] = useState(true);

    const handleMenuToggle = () => {
        if (containerRef.current) {
            const top = (containerRef.current as HTMLElement).offsetTop;
            window.scrollTo({ top, behavior: "smooth" });
        }
        setIsMenuOpen(!isMenuOpen);
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const isCoffee = latest <= 0.5;
        setShowCoffeeContent(isCoffee);
        setMenuScrollable(latest < 0.3);
        if (!isCoffee && isMenuOpen) {
            setIsMenuOpen(false);
        }
    });

    // 1. Panel Animation: Slides continuously from right to left
    // First, map the scroll so it only animates between 10% and 90% of the container.
    // This allows the user to read the text before it starts flying away.
    const rawProgress = useTransform(scrollYProgress, [0.1, 1], [0, 1]);

    // Then, take that 0-to-1 progress, ease it, and calculate the position
    const panelX = useTransform(rawProgress, (p) => {
        // TIGHTER EASE: Cubic Ease-In-Out
        // Starts slower, speeds up more in the middle, and brakes harder at the end
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

        return `calc(${-96.75 * eased}vw + ${100 * eased}%)`;
    });

    // 2. Background Continuous Pan: Both images pan slightly to the right
    const bgX = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);

    // 3. The Crossfade Transition: Now starts at 30% and finishes at 50%
    // We explicitly set the values for 0 (start) and 1 (end) to lock them in place
    const bg1Opacity = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5, 1],
        [1, 1, 0, 0],
    );
    const bg2Opacity = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5, 1],
        [0, 0, 1, 1],
    );

    const CoffeeGalleryContentOpacity = useTransform(
        scrollYProgress,
        [0, 0.3, 0.45, 1], // Wait until 30%, finish fading by 50%
        [1, 1, 0, 0], // Stay at 1, fade to 0, stay at 0
    );

    const ConceptStoreContentOpacity = useTransform(
        scrollYProgress,
        [0, 0.55, 0.8, 1], // Wait until 55%, fade in by 80%, lock until 100%
        [0, 0, 1, 1], // Stay at 0, stay at 0, reach 1, stay at 1
    );

    return (
        <div ref={containerRef} id="spaces" className="relative h-[300vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
                {/* BACKGROUND 1: Fades OUT in the middle of the scroll */}
                <motion.div
                    className="absolute inset-y-0 h-full w-[120%] bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${CoffeeGalleryBg.src})`,

                        x: bgX,
                        opacity: bg1Opacity,
                    }}
                />

                {/* BACKGROUND 2: Fades IN in the middle of the scroll */}
                <motion.div
                    className="absolute inset-y-0 h-full w-[120%] bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${ConceptStoreBg.src})`,
                        x: bgX,
                        opacity: bg2Opacity,
                    }}
                />

                {/* Dark overlay for text readability (stays constant over both images) */}
                {/* <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" /> */}

                {/* HOVERING DIV (Content Panel) */}
                <motion.div
                    className="absolute right-[5%] lg:right-[1%] z-20 bg-white text-black w-[90%] lg:w-[35vw] font-sans h-[80vh] lg:h-[95vh]"
                    style={{ x: panelX }}
                >
                    {/* Child 1 - title or menu (scrollable area) */}
                    <div className={`absolute inset-0 p-3 lg:p-6 pb-24 lg:pb-32 ${isMenuOpen && showCoffeeContent && menuScrollable ? 'overflow-y-auto' : 'overflow-hidden'} z-10`}>
                        <AnimatePresence mode="wait">
                            {isMenuOpen && showCoffeeContent ? (
                                <motion.div 
                                    key="menu"
                                    style={{ opacity: CoffeeGalleryContentOpacity }}
                                >
                                    <MenuContent />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, y: 0, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: 0, filter: "blur(4px)" }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    {showCoffeeContent ? (
                                        <motion.div
                                            style={{
                                                opacity: CoffeeGalleryContentOpacity,
                                            }}
                                        >
                                            <p className="lg:text-2xl">Coffee_gallery</p>
                                            <p className="text-2xl lg:text-[clamp(1.75rem,4.5vh,52px)] font-medium leading-normal lg:leading-tight mt-2">
                                                The smell of coffee. The pull of art. A
                                                space that was always meant to feel like
                                                this.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            style={{
                                                opacity: ConceptStoreContentOpacity,
                                            }}
                                        >
                                            <p className="lg:text-2xl">Events_space</p>
                                            <p className="mb-3 mt-2 text-2xl lg:text-[clamp(1.75rem,4.5vh,52px)] font-medium leading-normal lg:leading-tight">
                                                Every visit, a different world. Design,
                                                fashion, and art, thoughtfully arranged,
                                                always evolving.
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Child 2 - bottom section */}

                    {showCoffeeContent ? (
                        <motion.div
                            style={{
                                opacity: CoffeeGalleryContentOpacity,
                            }}
                            className={`absolute bottom-0 left-0 w-full flex flex-row justify-between border-t lg:border-none p-3 pt-3 lg:p-6 text-sm items-center z-30 pointer-events-none ${isMenuOpen ? 'border-transparent' : 'border-gray-300 bg-white'}`}
                        >
                            {/* Gradient Overlay for the menu scroll */}
                            {isMenuOpen && (
                                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none -z-10" />
                            )}
                            
                            <div className={`max-w-[90%] lg:text-[20px] transition-opacity duration-300 pointer-events-auto ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <p>
                                    The building used to generate electricity.
                                    We think it still does.
                                </p>
                            </div>
                            
                            <button 
                                onClick={handleMenuToggle}
                                className={`pointer-events-auto p-1 px-2 border-2 border-black text-lg lg:text-2xl lg:ml-2 font-semibold hover:bg-black hover:text-white transition-colors duration-300 whitespace-nowrap shrink-0 z-10 ${isMenuOpen ? 'bg-white shadow-xl' : ''}`}
                            >
                                {isMenuOpen ? "Close" : "View Menu"}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            style={{ opacity: ConceptStoreContentOpacity }}
                            className="absolute bottom-0 left-0 w-full flex flex-row items-center justify-between border-t border-gray-300 lg:border-none px-3 pt-3 pb-3 lg:p-6 text-sm z-30 pointer-events-none bg-white"
                        >
                            <div className="lg:text-[20px] pointer-events-auto">
                                <p>
                                    90m² of rotating design, fashion, and art.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
