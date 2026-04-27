"use client";

import Image from "next/image";
import Link from "next/link";
import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";
import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const containerVariants = {
    initial: {},
    animate: {
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    initial: {
        opacity: 0,
        y: 60,
        scale: 0.95,
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

export default function EventsSection({
    eventsData,
}: {
    eventsData?: { slug: string; title: string; coverImageUrl: string }[];
}) {
    if (!eventsData || eventsData.length === 0) return null;
    return <EventsSectionInner eventsData={eventsData} />;
}

function EventsSectionInner({
    eventsData,
}: {
    eventsData: { slug: string; title: string; coverImageUrl: string }[];
}) {
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable area

    const [isTriggered, setIsTriggered] = useState(false);

    // --- DRAG STATE ---
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasMoved, setHasMoved] = useState(false);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 60%", "start 0%"],
    });

    const dragStartPos = useRef(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > 0) setIsTriggered(true);
        else setIsTriggered(false);
    });

    // --- DRAG HANDLERS ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setHasMoved(false);

        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        dragStartPos.current = e.pageX; // Record the exact pixel where click started
        setStartX(x);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;

        // 2. Calculate how far the mouse has moved from the initial click point
        const distanceMoved = Math.abs(e.pageX - dragStartPos.current);

        // 3. Only treat it as a "drag" if moved more than 5 pixels
        if (distanceMoved > 5) {
            setHasMoved(true);
        }

        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        if (hasMoved) {
            e.preventDefault(); // Stop navigation if we were dragging
        }
    };

    return (
        <div ref={sectionRef} id="events" className="relative -mt-11 lg:-mt-16">
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

            <motion.div
                initial={{ paddingTop: "88px" }}
                animate={
                    isTriggered ? { paddingTop: "0px" } : { paddingTop: "88px" }
                }
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-0.5 pb-2 lg:pb-6 bg-mist-900"
            />

            {/* DRAGGABLE CARDS ROW */}
            <div
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseLeave={handleMouseLeaveOrUp}
                className={`bg-mist-900 px-4 pt-4 pb-7 lg:px-8 lg:pb-10 overflow-x-auto overflow-y-hidden select-none [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white [scrollbar-color:white_transparent] [scrollbar-width:medium] ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
            >
                <motion.div
                    className="flex gap-5 lg:gap-6 w-max"
                    variants={containerVariants}
                    initial="initial"
                    animate={isTriggered ? "animate" : "initial"}
                >
                    {eventsData.map((event) => (
                        <motion.div
                            key={event.slug}
                            variants={cardVariants}
                            className="shrink-0"
                            whileHover={
                                !isDragging
                                    ? { y: -8, transition: { duration: 0.2 } }
                                    : {}
                            }
                        >
                            <Link
                                href={`/events/${event.slug}`}
                                onClick={handleLinkClick}
                                draggable={false} // Prevents native ghost image drag
                                className="block h-115 w-75 bg-white text-black lg:h-155 lg:w-117.5 overflow-hidden pointer-events-auto"
                            >
                                <div className="flex h-full flex-col items-center pointer-events-none">
                                    <div className="w-full min-w-0 p-3 lg:p-5">
                                        <p className="w-full min-w-0 text-center font-semibold text-2xl lg:text-3xl uppercase line-clamp-2">
                                            {event.title}
                                        </p>
                                    </div>
                                    <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-gray-200">
                                        <Image
                                            fill
                                            className="object-cover transition-transform duration-500"
                                            src={
                                                event.coverImageUrl ||
                                                ConceptStoreBg
                                            }
                                            alt={event.title}
                                            draggable={false}
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
