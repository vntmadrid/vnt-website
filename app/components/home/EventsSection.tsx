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

export default function EventsSection() {
    const sectionRef = useRef(null);
    const [isTriggered, setIsTriggered] = useState(false);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        // Progress begins (0) when the top of the section hits 25% from the top of the viewport
        // Progress ends (1) when the top of the section hits 0% (the top of the viewport)
        offset: ["start 60%", "start 0%"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // As soon as progress is greater than 0, it has crossed the 25% line
        if (latest > 0) {
            setIsTriggered(true);
        } else {
            setIsTriggered(false);
        }
    });

    return (
        <div ref={sectionRef} id="events" className="relative -mt-11 lg:-mt-16">
            {/* EVENTS_ BAR — overlaps section above */}
            <motion.div
                initial={{ y: 80 }}
                animate={isTriggered ? { y: 0 } : { y: 80 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
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

            {/* <div className="relative z-10 flex items-end justify-between px-4 lg:px-8 lg:py-0">
                <h2 className="font-sans text-3xl px-4 lg:px-6 lg:pr-5.5 pt-2 lg:pt-4 lg:-mb-2 font-bold uppercase text-white bg-mist-900 lg:text-5xl">
                    EVENTS_
                </h2>
                <Link
                    href="/events"
                    className="font-sans text-2xl px-3 lg:px-4 pt-1 lg:pt-2 -mb-1.5 lg:text-3xl font-bold uppercase text-white bg-mist-900 "
                >
                    VIEW ALL
                </Link>
            </div> */}

            {/* BUTTONS SEPARATOR */}
            <motion.div
                initial={{ paddingTop: "88px" }}
                animate={
                    isTriggered ? { paddingTop: "0px" } : { paddingTop: "88px" }
                }
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-0.5 pb-6 lg:pb-10 bg-mist-900"
            />

            {/* <div className="h-0.5 pb-6 lg:pb-10 bg-mist-900" /> */}
            {/* //! When i come back animate the top padding, and then animate the y values of the title and button */}
            {/* CARDS ROW */}
            <div
                className="bg-mist-900 px-4 pb-7 lg:px-8 lg:pb-10 overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white [scrollbar-color:white_transparent] [scrollbar-width:medium]"
            >
                <div className="flex gap-5 lg:gap-6 w-max">
                    {events.map((event) => (
                        <Link
                            key={event.slug}
                            href={`/events/${event.slug}`}
                            className="h-115 w-75 shrink-0 bg-white text-black lg:h-155 lg:w-117.5"
                        >
                            <div className="flex h-full flex-col items-center">
                                <div className="w-full min-w-0 p-3 lg:p-5">
                                    <p className="w-full min-w-0 truncate text-center font-semibold text-2xl lg:text-5xl uppercase">
                                        {event.title}
                                    </p>
                                </div>
                                <Image
                                    className="h-full w-full object-cover"
                                    src={ConceptStoreBg}
                                    alt={event.title}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
