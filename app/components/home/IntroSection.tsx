"use client";

import Image from "next/image";
import VntLogo from "@/public/VNT black logo.svg";
import InitialArtwork from "@/public/images/artwork.jpg";
import BgConcrete from "@/public/images/BgConcrete.jpg";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function IntroSection() {
    const [isAnimating, setIsAnimating] = useState(true);

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

            // Preserve layout width while scroll is locked to avoid post-animation jump.
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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-5 font-sans">
            <motion.div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${BgConcrete.src})` }}
                initial={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "none" }}
                transition={{
                    delay: 0.5,
                    duration: 1.3,
                    ease: [0, 0.086, 0, 0.997],
                }}
                onAnimationComplete={() => setIsAnimating(false)}
            />

            <motion.div
                className="bg-white text-black flex flex-row items-center lg:p-6 lg:gap-6 z-10"
                initial={{
                    scale: 1.2,
                    opacity: 0,
                    filter: "blur(10px)",
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    filter: "none",
                }}
                transition={{
                    delay: 1,
                    duration: 1.4,
                    ease: [0, 0.086, 0, 0.997],
                }}
            >
                {/* left side (desktop only) */}
                <div className="hidden lg:block text-center w-[200px]">
                    <p className="text-[20px] font-semibold mb-2">
                        VNT COFFEE_GALLERY
                    </p>
                    <p className="text-[16px]">
                        a space where design, art, and specialty coffee come
                        together. Located in a former electricity house, VNT
                        coffee_gallery was conceived as a living gallery a place
                        where creativity, craftsmanship, and community naturally
                        connect.
                    </p>
                </div>
                {/* center div */}
                <div className="lg:max-w-[420px]">
                    {/* Logo */}
                    <div className="p-3 lg:p-0 lg:mb-3">
                        <Image
                            src={VntLogo}
                            alt="VNT Logo"
                            className="h-10 lg:h-[76px]"
                        />
                    </div>
                    {/* Center img */}
                    <Image
                        src={InitialArtwork}
                        alt="Initial artwork"
                        className="w-auto h-[420px] object-cover"
                    />
                    {/* Bottom text */}
                    {/* Mobile version */}
                    <div className="block lg:hidden p-3">
                        <p>Built in a former electricity house.</p>
                        <p className="mb-3">Still generating something.</p>
                        <div className="flex flex-row justify-between border-t border-gray-300 pt-3 text-sm">
                            <div>
                                <p>Calle Novicidad 4</p>
                                <p>Madrid</p>
                            </div>
                            <p> Explore ↓</p>
                        </div>
                    </div>

                    {/* Desktop version (artwork description) */}
                    <div className="hidden lg:block text-center mt-5 text-sm">
                        <p>details about artpiece</p>
                    </div>
                </div>
                {/* right side (desktop only) */}
                <div className="hidden lg:block text-center w-[200px]">
                    <p className="text-[20px] font-semibold mb-2">
                        VNT CONCEPT_STORE
                    </p>
                    <p className="text-[16px]">
                        A 90 m² hybrid space conceived as a living platform for
                        brands and creators. Hosting pop-ups, exhibitions,
                        launches, talks, and gatherings, VNT+ offers a flexible
                        environment where ideas, products, and communities meet
                        through shared sensibilities.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
