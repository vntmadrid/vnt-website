"use client";

import Image from "next/image";
import Link from "next/link";
import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";
import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const events = [
    { slug: "beton-brut", title: "BÉTON BRUT" },
    { slug: "summer-opening", title: "Summer Opening" },
    { slug: "design-talk", title: "Design Talk" },
    { slug: "fashion-night", title: "Fashion Night" },
];

// Variants for the parent container to handle the stagger effect
const containerVariants = {
    initial: {},
    animate: {
        transition: {
            // Delay the cards slightly so the title and separator can animate first
            delayChildren: 0.2,
            // Time between each card animating in
            staggerChildren: 0.15,
        },
    },
};

// Variants for each individual card
const cardVariants = {
    initial: {
        opacity: 0,
        y: 60, // Start slightly lower
        scale: 0.95, // Slightly scaled down for a subtle "pop" effect
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            damping: 20,
            stiffness: 100,
        },
    },
};

export default function EventsSection() {
    const sectionRef = useRef(null);
    const [isTriggered, setIsTriggered] = useState(false);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 60%", "start 0%"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > 0) {
            setIsTriggered(true);
        } else {
            setIsTriggered(false);
        }
    });

    return (
        <div ref={sectionRef} id="events" className="relative -mt-11 lg:-mt-16">
            {/* EVENTS_ BAR */}
            <motion.div
                initial={{ y: 80 }}
                animate={isTriggered ? { y: 0 } : { y: 80 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10 flex items-end justify-between px-4 lg:px-8 lg:py-0"
            >
                <h2 className="font-sans text-3xl px-4 lg:px-6 lg:pr-5.5 pt-2 lg:pt-4 lg:-mb-2 font-bold uppercase text-white bg-mist-900 lg:text-5xl">
                    EVENTS_
                </h2>
                <motion.div initial={{ y: -1 }}>
                    <Link
                        href="/events"
                        className="font-sans text-2xl px-3 lg:px-4 pt-1 lg:pt-2 -mb-1.5 lg:text-3xl font-bold uppercase text-white bg-mist-900 "
                    >
                        VIEW ALL
                    </Link>
                </motion.div>
            </motion.div>

            {/* BUTTONS SEPARATOR */}
            <motion.div
                initial={{ paddingTop: "88px" }}
                animate={
                    isTriggered ? { paddingTop: "0px" } : { paddingTop: "88px" }
                }
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-0.5 pb-2 lg:pb-6 bg-mist-900"
            />

            {/* CARDS ROW */}
            <div className="bg-mist-900 px-4 pt-4 pb-7 lg:px-8 lg:pb-10 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white [scrollbar-color:white_transparent] [scrollbar-width:medium]">
                <motion.div
                    className="flex gap-5 lg:gap-6 w-max"
                    variants={containerVariants}
                    initial="initial"
                    animate={isTriggered ? "animate" : "initial"}
                >
                    {events.map((event) => (
                        <motion.div
                            key={event.slug}
                            variants={cardVariants}
                            className="shrink-0"
                            // Adding a subtle hover effect to make the cards feel interactive
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.2 },
                            }}
                        >
                            <Link
                                href={`/events/${event.slug}`}
                                className="block h-115 w-75 bg-white text-black lg:h-155 lg:w-117.5 overflow-hidden"
                            >
                                <div className="flex h-full flex-col items-center">
                                    <div className="w-full min-w-0 p-3 lg:p-5">
                                        <p className="w-full min-w-0 truncate text-center font-semibold text-2xl lg:text-5xl uppercase">
                                            {event.title}
                                        </p>
                                    </div>
                                    <div className="relative h-full w-full overflow-hidden">
                                        <Image
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                            src={ConceptStoreBg}
                                            alt={event.title}
                                        />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
