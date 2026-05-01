"use client";

import { Link } from "next-view-transitions";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

interface HomeStickyHeaderProps {
    lang: string;
}

export default function HomeStickyHeader({ lang }: HomeStickyHeaderProps) {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        // Switch to faster scroll animations after the initial page load finishes
        const timer = setTimeout(() => setHasLoaded(true), 3500);
        return () => clearTimeout(timer);
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        // Hide header if scrolling down and we've scrolled past 100px.
        // Show header if scrolling up.
        if (latest > previous && latest > 100) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const handleScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        targetId: string,
    ) => {
        e.preventDefault();
        const elem = document.getElementById(targetId);
        if (elem) {
            let headerOffset = 0; // Adjust this value to match your header height

            // If navigating to the collaborate section from above the events section,
            // subtract 88px to account for the EventsSection animation that shrinks the height.
            if (targetId === "collaborate") {
                const eventsElem = document.getElementById("events");
                if (eventsElem && eventsElem.getBoundingClientRect().top > 0) {
                    headerOffset += 88;
                }
            }

            const elementPosition = elem.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    const t = {
        spaces: lang === "es" ? "Tienda" : "Store",
        collaborate: lang === "es" ? "Colabora" : "Collaborate",
        events: lang === "es" ? "Eventos" : "Events",
    };

    return (
        <motion.header
            initial="hidden"
            animate={hidden ? "hidden" : "visible"}
            className="fixed left-0 right-0 top-0 z-50 flex justify-center pt-4 pointer-events-none"
        >
            <div className="flex items-center justify-center pointer-events-auto">
                <motion.nav className="flex gap-2">
                    {/* SPACES: Drags behind during intial load, shorter duration on scroll */}
                    <motion.div
                        variants={{
                            visible: {
                                y: 0,
                                opacity: 1,
                                transition: hasLoaded
                                    ? {
                                          duration: 0.3,
                                          ease: [0, 0.086, 0, 0.997],
                                          delay: 0.05,
                                      }
                                    : {
                                          duration: 1.2,
                                          ease: [0, 0.086, 0, 0.997],
                                          delay: 1.3,
                                      },
                            },
                            hidden: {
                                y: -60,
                                opacity: 0,
                                transition: {
                                    duration: 0.3,
                                    ease: "easeInOut",
                                },
                            },
                        }}
                    >
                        <Link
                            href={`/${lang}/shop`} // Direct path to your store
                            className="block font-sans text-sm font-bold uppercase tracking-widest text-black hover:text-gray-500 bg-white py-1 px-3 transition-colors"
                        >
                            {t.spaces}
                        </Link>
                    </motion.div>

                    {/* COLLABORATE: Center, leads the animation */}
                    <motion.div
                        variants={{
                            visible: {
                                y: 0,
                                opacity: 1,
                                transition: hasLoaded
                                    ? {
                                          duration: 0.25,
                                          ease: [0, 0.086, 0, 0.997],
                                      }
                                    : {
                                          duration: 0.8,
                                          ease: [0, 0.086, 0, 0.997],
                                          delay: 1.2,
                                      },
                            },
                            hidden: {
                                y: -60,
                                opacity: 0,
                                transition: {
                                    duration: 0.25,
                                    ease: "easeInOut",
                                },
                            },
                        }}
                    >
                        <Link
                            href="#collaborate"
                            onClick={(e) => handleScroll(e, "collaborate")}
                            className="block font-sans text-sm font-bold uppercase tracking-widest text-black hover:text-gray-500 bg-white py-1 px-3 transition-colors"
                        >
                            {t.collaborate}
                        </Link>
                    </motion.div>

                    {/* EVENTS: Drags behind during intial load, shorter duration on scroll */}
                    <motion.div
                        variants={{
                            visible: {
                                y: 0,
                                opacity: 1,
                                transition: hasLoaded
                                    ? {
                                          duration: 0.3,
                                          ease: [0, 0.086, 0, 0.997],
                                          delay: 0.05,
                                      }
                                    : {
                                          duration: 1.2,
                                          ease: [0, 0.086, 0, 0.997],
                                          delay: 1.3,
                                      },
                            },
                            hidden: {
                                y: -60,
                                opacity: 0,
                                transition: {
                                    duration: 0.3,
                                    ease: "easeInOut",
                                },
                            },
                        }}
                    >
                        <Link
                            href="#events"
                            onClick={(e) => handleScroll(e, "events")}
                            className="block font-sans text-sm font-bold uppercase tracking-widest text-black hover:text-gray-500 bg-white py-1 px-3 transition-colors"
                        >
                            {t.events}
                        </Link>
                    </motion.div>
                </motion.nav>
            </div>
        </motion.header>
    );
}
