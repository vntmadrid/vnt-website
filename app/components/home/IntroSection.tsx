"use client";

import Image from "next/image";
import VntLogo from "@/public/VNT black logo.svg";
import InitialArtwork from "@/public/images/artwork.jpg";
import BgConcrete from "@/public/images/BgConcrete.jpg";
import VntConcrete from "@/public/images/VNTconcrete.jpg";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface IntroSectionProps {
    leftTitle?: string;
    leftBody?: string;
    rightTitle?: string;
    rightBody?: string;
    backgroundImage?: string;
    featuredImage?: string;
}

export default function IntroSection({
    leftTitle,
    leftBody,
    rightTitle,
    rightBody,
    backgroundImage,
    featuredImage,
}: IntroSectionProps) {
    const [isAnimating, setIsAnimating] = useState(true);

    const scrollToNext = () => {
        const viewportHeight = window.innerHeight;
        window.scrollTo({
            top: viewportHeight,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const previousRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);

        return () => {
            window.history.scrollRestoration = previousRestoration;
        };
    }, []);

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;
        const prevBodyPaddingRight = body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - html.clientWidth;

        if (isAnimating) {
            html.style.overflow = "hidden";
            body.style.overflow = "hidden";

            if (scrollbarWidth > 0) {
                body.style.paddingRight = `${scrollbarWidth}px`;
            }
        } else {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
            body.style.paddingRight = prevBodyPaddingRight;
        }

        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
            body.style.paddingRight = prevBodyPaddingRight;
        };
    }, [isAnimating]);

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-5 pt-8 font-sans">
            {/* BACKGROUND */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${BgConcrete.src || backgroundImage})`,
                }}
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1.05, opacity: 1 }}
                transition={{
                    duration: .6,
                    ease: "easeOut",
                    delay: .6
                }}
            />

            {/* ========================================= */}
            {/* DESKTOP ANIMATION WRAPPER (lg screens up) */}
            {/* ========================================= */}
            <motion.div
                className="hidden lg:flex bg-white text-black flex-row items-center z-10 relative max-w-max"
                initial={{
                    opacity: 0,
                    scale: 0.8,
                    padding: "0.5rem",
                    gap: "0rem",
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    padding: "1.5rem",
                    gap: "1.5rem",
                }}
                transition={{
                    opacity: { duration: 0.8 },
                    scale: { duration: 1.6, ease: [0.76, 0, 0.24, 1] },
                    padding: {
                        delay: 0.6,
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                    },
                    gap: { delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] },
                }}
                onAnimationComplete={() => setIsAnimating(false)}
            >
                {/* LEFT SIDE TEXT */}
                <motion.div
                    className="flex justify-end overflow-hidden"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    transition={{
                        delay: 0.6,
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    <div className="w-[200px] flex-shrink-0 text-center">
                        <p className="text-[20px] font-semibold mb-2">
                            {leftTitle}
                        </p>
                        <p className="text-[16px]">{leftBody}</p>
                    </div>
                </motion.div>

                {/* DESKTOP CENTER IMAGE */}
                <div className="w-full max-w-[420px] relative z-10 bg-white flex-shrink-0">
                    <Image
                        src={featuredImage || VntConcrete}
                        alt="Initial artwork"
                        width={420}
                        height={420}
                        className="w-full aspect-square object-cover"
                        priority
                    />
                </div>

                {/* RIGHT SIDE TEXT */}
                <motion.div
                    className="flex justify-start overflow-hidden"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    transition={{
                        delay: 0.6,
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    <div className="w-[200px] flex-shrink-0 text-center">
                        <p className="text-[20px] font-semibold mb-2">
                            {rightTitle}
                        </p>
                        <p className="text-[16px]">{rightBody}</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* ========================================= */}
            {/* MOBILE ANIMATION WRAPPER (below lg screens) */}
            {/* ========================================= */}
            <motion.div
                className="flex lg:hidden flex-col bg-white text-black z-10 relative w-full max-w-[420px] shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                onAnimationComplete={() => setIsAnimating(false)}
            >
                {/* Image container with hidden overflow so we can scale the image safely inside it */}
                <div className="w-full aspect-square relative overflow-hidden bg-gray-100">
                    <motion.div
                        initial={{ scale: 1.15 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
                        className="w-full h-full"
                    >
                        <Image
                            src={featuredImage || VntConcrete}
                            alt="Initial artwork"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </div>

                {/* Mobile Text (Fades in slightly after the card appears) */}
                <motion.div
                    className="p-4 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <p>Built in a former electricity house.</p>
                    <p className="mb-3">Still generating something.</p>
                    <div className="flex flex-row justify-between border-t border-gray-300 pt-3 text-sm">
                        <div>
                            <p>Calle Novicidad 4</p>
                            <p>Madrid</p>
                        </div>
                        <p> Explore ↓</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* SCROLL ARROW */}
            <AnimatePresence>
                {!isAnimating && (
                    <motion.button
                        onClick={scrollToNext}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: [0, 10, 0] }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                            opacity: { duration: 0.5 },
                            y: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                        className="absolute bottom-10 z-20 text-white p-2 cursor-pointer hover:opacity-70 transition-opacity"
                        aria-label="Scroll to next section"
                    >
                        <ChevronDown size={60} strokeWidth={1} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
