import Image from "next/image";
import Link from "next/link";
import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";

const events = [
    { slug: "beton-brut", title: "BÉTON BRUT" },
    { slug: "summer-opening", title: "Summer Opening" },
    { slug: "design-talk", title: "Design Talk" },
    { slug: "fashion-night", title: "Fashion Night" },
];

export default function EventsSection() {
    return (
        <div className="relative -mt-11 lg:-mt-16">
            {/* EVENTS_ BAR — overlaps section above */}
            <div className="relative z-10 flex items-end justify-between px-4 lg:px-8 lg:py-0">
                <h2 className="font-sans text-3xl px-4 lg:px-6 lg:pr-5.5 pt-2 lg:pt-4 lg:-mb-2 font-bold uppercase text-white bg-mist-900 lg:text-5xl">
                    EVENTS_
                </h2>
                <Link
                    href="/events"
                    className="font-sans text-2xl px-3 lg:px-4 pt-1 lg:pt-2 -mb-1.5 lg:text-3xl font-bold uppercase text-white bg-mist-900 "
                >
                    VIEW ALL
                </Link>
            </div>

            {/* BUTTONS SEPARATOR */}
            <div className="h-0.5 pb-6 lg:pb-10 bg-mist-900"/>

            {/* CARDS ROW */}
            <div className="bg-mist-900 px-4 pb-7 lg:px-8 lg:pb-10 overflow-x-auto">
                <div className="flex gap-5 lg:gap-6">
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
