"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import VNTlogo from "@/public/VNT black logo.svg";

interface EventsHeaderProps {
    lang: string;
    isDetailPage?: boolean;
}

export default function EventsHeader({
    lang,
    isDetailPage = false,
}: EventsHeaderProps) {
    const [isExiting, setIsExiting] = useState(false);
    const pastEventsText = lang === "es" ? "EVENTOS PASADOS" : "PAST EVENTS";

    const handleBackClick = () => {
        setIsExiting(true);
    };

    return (
        <div
            className={`flex flex-row justify-between items-center p-6 ${!isDetailPage ? "mb-" : ""}`}
        >
            <Link href={`/${lang}`}>
                <Image
                    src={VNTlogo}
                    alt={"VntLogo"}
                    className="brightness-0 invert w-fit h-14 lg:h-16"
                />
            </Link>

            <div>
                {isDetailPage ? (
                    <Link
                        href={`/${lang}/events`}
                        onClick={handleBackClick}
                        className="text-2xl lg:text-3xl font-semibold text-white hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <AnimatePresence>
                            {!isExiting && (
                                <motion.div
                                    key="back-arrow"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0, 0.16, 0.096, 0.987],
                                    }}
                                >
                                    <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {pastEventsText}
                    </Link>
                ) : (
                    <p className="text-2xl lg:text-3xl font-semibold text-white">
                        {pastEventsText}
                    </p>
                )}
            </div>
        </div>
    );
}
