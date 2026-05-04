"use client";

import { useRef, useState, useEffect } from "react";
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

export default function vntSpaces({ data }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showCoffeeContent, setShowCoffeeContent] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuScrollable, setMenuScrollable] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleMenuToggle = () => {
        if (containerRef.current) {
            const top = (containerRef.current as HTMLElement).offsetTop;
            // On mobile, the container height is very large, so we just want to scroll to the top of the container
            // On desktop, the container is 300vh, but scrolling to its top is fine
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
        if (!isMobile && !isCoffee && isMenuOpen) {
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

    // 2. Background Continuous Pan:
    // On desktop, it pans slightly to the right
    const bgX = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);
    // On mobile, it pans upwards (or downwards depending on the mapping)
    const bgY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

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
        <div
            ref={containerRef}
            id="spaces"
            className="relative lg:h-[300vh] bg-black"
        >
            {/* DESKTOP LAYOUT (Preserved Animations) */}
            <div className="hidden lg:flex sticky top-0 h-screen w-full overflow-hidden items-center justify-center">
                {/* BACKGROUND 1: Fades OUT in the middle of the scroll */}
                <motion.div
                    className="absolute inset-0 h-[120%] w-full lg:h-full lg:w-[120%] bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${data?.coffeeBgUrl || CoffeeGalleryBg.src})`,

                        x: mounted && !isMobile ? bgX : 0,
                        y: mounted && isMobile ? bgY : 0,
                        opacity: bg1Opacity,
                    }}
                />

                {/* BACKGROUND 2: Fades IN in the middle of the scroll */}
                <motion.div
                    className="absolute inset-0 h-[120%] w-full lg:h-full lg:w-[120%] bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${data?.conceptBgUrl || ConceptStoreBg.src})`,
                        x: mounted && !isMobile ? bgX : 0,
                        y: mounted && isMobile ? bgY : 0,
                        opacity: bg2Opacity,
                    }}
                />

                {/* Dark overlay for text readability (stays constant over both images) */}
                {/* <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" /> */}

                {/* HOVERING DIV (Content Panel) - DESKTOP ONLY */}
                <motion.div
                    className={`hidden lg:block absolute z-20 bg-white text-black font-sans
                        bottom-3 left-3 w-[calc(100%-24px)] ${isMenuOpen ? "h-[35vh]" : "h-[25vh]"} rounded-none overflow-hidden transition-[height] duration-500 ease-in-out
                        lg:bottom-auto lg:top-auto lg:right-[1%] lg:left-auto lg:!h-[95vh] lg:w-[35vw] lg:rounded-none lg:overflow-visible`}
                    style={{ x: mounted && !isMobile ? panelX : 0 }}
                >
                    {/* Child 1 - title or menu (scrollable area) */}
                    <div
                        className={`absolute inset-0 p-4 lg:p-5 xl:p-6 ${isMenuOpen && showCoffeeContent && menuScrollable ? "overflow-y-auto" : "overflow-hidden"} z-10`}
                    >
                        <AnimatePresence mode="wait">
                            {isMenuOpen && showCoffeeContent ? (
                                <motion.div
                                    key="menu"
                                    style={{
                                        opacity: CoffeeGalleryContentOpacity,
                                    }}
                                >
                                    <MenuContent menuData={data} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="content"
                                    initial={{
                                        opacity: 0,
                                        y: 0,
                                        filter: "blur(4px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: 0,
                                        filter: "blur(4px)",
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeOut" as const,
                                    }}
                                >
                                    {showCoffeeContent ? (
                                        <motion.div
                                            style={{
                                                opacity:
                                                    CoffeeGalleryContentOpacity,
                                            }}
                                        >
                                            <p className="text-sm lg:text-2xl">
                                                {data?.coffeeLabel ||
                                                    "Coffee_gallery"}
                                            </p>
                                            <p className="max-w-md lg:max-w-none text-xl sm:text-2xl lg:text-[clamp(1.75rem,4.5vh,52px)] font-medium leading-tight lg:leading-tight mt-2 min-h-[60px] lg:min-h-0">
                                                {data?.coffeeTitle ||
                                                    "The smell of coffee. The pull of art. A space that was always meant to feel like this."}
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            style={{
                                                opacity:
                                                    ConceptStoreContentOpacity,
                                            }}
                                        >
                                            <p className="text-sm lg:text-2xl">
                                                {data?.conceptLabel ||
                                                    "Events_space"}
                                            </p>
                                            <p className="max-w-md lg:max-w-none mb-3 mt-2 text-xl sm:text-2xl lg:text-[clamp(1.75rem,4.5vh,52px)] font-medium leading-tight lg:leading-tight">
                                                {data?.conceptTitle ||
                                                    "Every visit, a different world. Design, fashion, and art, thoughtfully arranged, always evolving."}
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
                            className={`absolute bottom-0 left-0 w-full flex flex-row justify-between border-t lg:border-none p-3 pt-3 lg:p-5 xl:p-6 text-sm items-center z-30 pointer-events-none ${isMenuOpen ? "border-transparent" : "border-gray-300 bg-white"}`}
                        >
                            {/* Gradient Overlay for the menu scroll */}
                            {isMenuOpen && (
                                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none -z-10" />
                            )}

                            <div
                                className={`max-w-[70%] lg:max-w-[70%] text-sm lg:text-base xl:text-xl transition-opacity duration-300 pointer-events-auto ${isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                            >
                                <p>
                                    {data?.coffeeDesc ||
                                        "The building used to generate electricity. We think it still does."}
                                </p>
                            </div>

                            <button
                                onClick={handleMenuToggle}
                                className={`pointer-events-auto p-1 px-2 border-2 border-black text-base lg:text-[20px] ml-auto lg:ml-2 font-semibold hover:bg-black hover:text-white transition-colors duration-300 whitespace-nowrap shrink-0 z-10 ${isMenuOpen ? "bg-white shadow-xl" : ""}`}
                            >
                                {isMenuOpen
                                    ? "Close"
                                    : data?.menuButtonText || "View Menu"}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            style={{ opacity: ConceptStoreContentOpacity }}
                            className="absolute bottom-0 left-0 w-full flex flex-row items-center justify-between border-t border-gray-300 lg:border-none px-3 pt-3 pb-3 lg:p-5 xl:p-6 text-sm z-30 pointer-events-none bg-white"
                        >
                            <div className="text-sm lg:text-base xl:text-xl pointer-events-auto max-w-[70%] lg:max-w-none">
                                <p>
                                    {data?.conceptDesc ||
                                        "90m² of rotating design, fashion, and art."}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* MOBILE LAYOUT (Clean Static Stack) */}
            <div className="block lg:hidden w-full bg-black">
                {/* Coffee Gallery Section */}
                <section className="relative w-full h-screen">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${data?.coffeeBgUrl || CoffeeGalleryBg.src})`,
                        }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-3 pb-3 pointer-events-none">
                        <div
                            className={`w-full bg-white text-black font-sans rounded-none transition-[height] duration-500 ease-in-out pointer-events-auto flex flex-col justify-between ${isMenuOpen ? "h-[65vh]" : "h-[25vh]"}`}
                        >
                            <div
                                className={`p-4 flex-1 ${isMenuOpen ? "overflow-y-auto" : "overflow-hidden"}`}
                            >
                                {isMenuOpen ? (
                                    <MenuContent menuData={data} />
                                ) : (
                                    <>
                                        <p className="text-sm">
                                            {data?.coffeeLabel ||
                                                "Coffee_gallery"}
                                        </p>
                                        <p className="text-xl sm:text-2xl font-medium leading-tight mt-2 min-h-[60px]">
                                            {data?.coffeeTitle ||
                                                "The smell of coffee. The pull of art. A space that was always meant to feel like this."}
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-row justify-between border-t border-gray-300 p-3 text-sm items-center w-full bg-white relative">
                                <div
                                    className={`max-w-[70%] transition-opacity duration-300 ${isMenuOpen ? "opacity-0 pointer-events-none absolute" : "opacity-100"}`}
                                >
                                    <p>
                                        {data?.coffeeDesc ||
                                            "The building used to generate electricity. We think it still does."}
                                    </p>
                                </div>
                                <button
                                    onClick={handleMenuToggle}
                                    className={`p-1 px-2 border-2 border-black text-base font-semibold hover:bg-black hover:text-white transition-colors duration-300 whitespace-nowrap shrink-0 z-10 ml-auto`}
                                >
                                    {isMenuOpen
                                        ? "Close"
                                        : data?.menuButtonText || "View Menu"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Concept Store Section */}
                <section className="relative w-full h-[100vh] min-h-[500px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${data?.conceptBgUrl || ConceptStoreBg.src})`,
                        }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-3 pb-3 pointer-events-none">
                        <div className="w-full bg-white text-black font-sans rounded-none min-h-[25vh] pointer-events-auto flex flex-col justify-between">
                            <div className="p-4 overflow-hidden flex-1">
                                <p className="text-sm">
                                    {data?.conceptLabel || "Events_space"}
                                </p>
                                <p className="text-xl sm:text-2xl font-medium leading-tight mt-2 min-h-[60px]">
                                    {data?.conceptTitle ||
                                        "Every visit, a different world. Design, fashion, and art, thoughtfully arranged, always evolving."}
                                </p>
                            </div>
                            <div className="flex flex-row items-center justify-between border-t border-gray-300 px-3 py-3 text-sm w-full">
                                <div className="max-w-[100%]">
                                    <p>
                                        {data?.conceptDesc ||
                                            "90m² of rotating design, fashion, and art."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
