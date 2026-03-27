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
        <div className="bg-mist-900 p-5 lg:p-8 font-sans overflow-x-auto">
            <div className="flex gap-4 lg:gap-6">
                {events.map((event) => (
                    <Link
                        key={event.slug}
                        href={`/events/${event.slug}`}
                        className="h-125 w-75 shrink-0 bg-white text-black lg:h-155 lg:w-117.5"
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
    );
}
