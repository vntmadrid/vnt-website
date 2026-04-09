"use client";

import { useRef, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
    useMotionValueEvent,
} from "framer-motion";

import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";
import CoffeeGalleryBg from "@/public/images/CoffeeGalleryBg.png";

export default function CafeStoryScroll() {
    const containerRef = useRef(null);
    const [showCoffeeContent, setShowCoffeeContent] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setShowCoffeeContent(latest <= 0.5);
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
                    className="absolute right-[5%] lg:right-[1%] z-20 bg-white text-black w-[90%] lg:w-[35vw] lg:flex lg:flex-col lg:justify-between font-sans lg:h-[95vh]"
                    style={{ x: panelX }}
                >
                    {/* Child 1 - title */}
                    <div className="p-3 lg:p-6">
                        {showCoffeeContent ? (
                            <motion.div
                                style={{
                                    opacity: CoffeeGalleryContentOpacity,
                                }}
                            >
                                <p className="lg:text-2xl">Coffee_gallery</p>
                                <p className="text-2xl lg:text-[52px] font-medium lg:leading-16">
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
                                <p className="lg:text-2xl">Concept_store</p>
                                <p className="mb-3 text-2xl font-medium lg:text-[52px] lg:leading-16">
                                    Every visit, a different world. Design,
                                    fashion, and art, thoughtfully arranged,
                                    always evolving.
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Child 2 - bottom section */}

                    {showCoffeeContent ? (
                        <motion.div
                            style={{
                                opacity: CoffeeGalleryContentOpacity,
                            }}
                            className="flex flex-row justify-between border-t border-gray-300 lg:border-none p-3 pt-3 text-sm items-center"
                        >
                            <div className="max-w-[90%] lg:text-[20px]">
                                <p>
                                    The building used to generate electricity.
                                    We think it still does.
                                </p>
                            </div>
                            <div className="p-1 px-2 border-2 text-lg lg:text-2xl lg:ml-2 font-semibold">
                                <p className="whitespace-nowrap">View Menu →</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            style={{ opacity: ConceptStoreContentOpacity }}
                            className="mb-1 flex flex-row items-center justify-between border-t border-gray-300 lg:border-none pt-3 lg:p-3 lg:mb-0 text-sm"
                        >
                            <div className="lg:text-[20px]">
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
