"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import imagePlaceholder from "@/public/images/BgConcrete.jpg";

type EventCard = {
    slug: string;
    title: string;
    coverImageUrl: string;
};

type EventsCarouselProps = {
    lang: "en" | "es";
    events: EventCard[];
};

export default function EventsCarousel({ lang, events }: EventsCarouselProps) {
    const scrollRef = useRef<HTMLUListElement | null>(null);
    const dragStartXRef = useRef(0); // Tracks the exact pixel where the click started

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [hideControlsHint, setHideControlsHint] = useState(false);

    // --- DRAG STATE ---
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    const [moved, setMoved] = useState(false);

    const controlsHint =
        lang === "es" ? "Desliza o usa las flechas" : "Swipe or use arrows";

    const updateControls = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }, []);

    useEffect(() => {
        updateControls();
        window.addEventListener("resize", updateControls);
        return () => window.removeEventListener("resize", updateControls);
    }, [updateControls]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setHideControlsHint(true);
        }, 5000);
        return () => window.clearTimeout(timeoutId);
    }, []);

    // --- DRAG HANDLERS ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setMoved(false);

        dragStartXRef.current = e.pageX; // Pixel-perfect start point
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftState(scrollRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;

        // Threshold check: Has the user moved more than 5 pixels?
        const distanceMoved = Math.abs(e.pageX - dragStartXRef.current);
        if (distanceMoved > 5) {
            setMoved(true);
        }

        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeftState - walk;
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        // Only block the link if we actually exceeded the 5px drag threshold
        if (moved) {
            e.preventDefault();
        }
    };

    const scrollByAmount = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;

        const amount = Math.max(280, Math.floor(el.clientWidth * 0.7));
        el.scrollBy({
            left: direction === "right" ? amount : -amount,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative max-w-[100vw] -mt-24">
            <ul
                ref={scrollRef}
                onScroll={updateControls}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                /* ADDED pt-2 TO GIVE SPACE AT THE TOP */
                className={`no-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap px-4 pt-2 pb-4 lg:px-6 select-none ${
                    isDragging
                        ? "cursor-grabbing scroll-auto"
                        : "cursor-grab snap-x snap-mandatory scroll-smooth"
                }`}
            >
                {events.map((event) => (
                    <li
                        key={event.slug}
                        /* 1. Added 'transition-transform' here 
               2. Ensure 'hover:-translate-y-2' is here
            */
                        className="shrink-0 snap-center w-[70vw] max-w-[450px] sm:w-[390px] lg:w-[340px] xl:w-[400px] transition-transform duration-300 ease-out hover:-translate-y-2"
                    >
                        <Link
                            href={`/${lang}/events/${event.slug}`}
                            className="group block"
                            onClick={handleLinkClick}
                            draggable={false}
                        >
                            <div 
                                className="relative aspect-[4/5] w-full overflow-hidden pointer-events-none"
                                style={{
                                    viewTransitionName: `event-image-${event.slug.replace(/[^a-zA-Z0-9]/g, "-")}`,
                                }}
                            >
                                <Image
                                    fill
                                    className="object-cover transition-transform duration-300 ease-out lg:group-hover:scale-[1.015]"
                                    src={
                                        event.coverImageUrl || imagePlaceholder
                                    }
                                    alt={event.title}
                                    draggable={false}
                                />
                            </div>
                            <div
                                className="bg-white p-5 text-black flex items-center justify-center transition-colors duration-200 lg:group-hover:bg-zinc-100"
                                style={{
                                    viewTransitionName: `event-label-${event.slug.replace(/[^a-zA-Z0-9]/g, "-")}`,
                                }}
                            >
                                <p className="text-2xl lg:text-3xl font-semibold uppercase truncate text-center">
                                    {event.title}
                                </p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="mt-3 flex items-center justify-center gap-3 px-4 lg:px-6">
                <button
                    type="button"
                    aria-label="Scroll events left"
                    onClick={() => scrollByAmount("left")}
                    disabled={!canScrollLeft}
                    className="h-11 w-11 rounded-none bg-white text-black flex items-center justify-center shadow-[0_4px_18px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div
                    className={`h-11 overflow-hidden rounded-none border border-zinc-700 text-zinc-200 text-xs uppercase tracking-wider transition-all duration-500 flex items-center ${hideControlsHint ? "max-w-0 px-0 opacity-0 border-transparent" : "max-w-[220px] px-4 opacity-100"}`}
                >
                    {controlsHint}
                </div>
                <button
                    type="button"
                    aria-label="Scroll events right"
                    onClick={() => scrollByAmount("right")}
                    disabled={!canScrollRight}
                    className="h-11 w-11 rounded-none bg-white text-black flex items-center justify-center shadow-[0_4px_18px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}
