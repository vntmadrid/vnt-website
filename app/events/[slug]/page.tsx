import Link from "next/link";
import Image from "next/image";
import VNTlogo from "@/public/VNT black logo.svg";
import ImagePlaceholder from "@/public/images/BgConcrete.jpg";
import EventInfoBlock from "@/app/components/events/EventInfoBlock";

import { notFound } from "next/navigation";

type EventPageProps = {
    params: Promise<{ slug: string }>;
};

type EventData = {
    title: string;
    description: string;
    artist: {
        name: string;
        description: string;
        siteHref: string;
    };
    typeInfo: {
        title: string;
        description?: string;
    };
    space: {
        title: "VNT Coffee_Gallery" | "VNT Concept_store";
        description: "40m²" | "90m²";
    };
};

const eventBySlug: Record<string, EventData> = {
    "summer-opening": {
        title: "SUMMER OPENING",
        description:
            "A one-night gathering shaped by heat, shadow, and saturated color — an opening built around movement, sound, and spontaneous encounters. Summer Opening brought together local artists and DJs in a space tuned for late light, raw textures, and the quiet tension between celebration and stillness.",
        artist: {
            name: "Colectivo Gris",
            description: "Documentary photography collective based in Madrid.",
            siteHref: "#",
        },
        typeInfo: {
            title: "Group Exhibition",
            description: "Temporary showcase",
        },
        space: {
            title: "VNT Coffee_Gallery",
            description: "40m²",
        },
    },
    "design-talk": {
        title: "DESIGN TALK",
        description:
            "An intimate conversation on interior language, visual identity, and material culture — tracing how objects, surfaces, and proportions shape the way we move through space. Design Talk invited architects, creatives, and founders into a focused dialogue on process, restraint, and the emotional weight of form.",
        artist: {
            name: "Lina Torres",
            description:
                "Interior editor and curator focused on material storytelling.",
            siteHref: "#",
        },
        typeInfo: {
            title: "Design Talk",
            description: "Panel discussion",
        },
        space: {
            title: "VNT Concept_store",
            description: "90m²",
        },
    },
    "fashion-night": {
        title: "FASHION NIGHT",
        description:
            "An evening defined by silhouette, rhythm, and contrast — a live sequence of pop-up moments and runway gestures from guest brands working at the edge of craft and experimentation. Fashion Night transformed the gallery into a temporary stage where garments, bodies, and architecture moved in dialogue.",
        artist: {
            name: "Atelier Nueve",
            description:
                "Independent fashion label blending tailoring and performance.",
            siteHref: "#",
        },
        typeInfo: {
            title: "Pop-up Event",
            description: "Runway and retail hybrid",
        },
        space: {
            title: "VNT Concept_store",
            description: "90m²",
        },
    },
    "beton-brut": {
        title: "BÉTON BRUT",
        description:
            "A six-week exhibition drawing from the raw visual language of brutalist architecture — exposed concrete, unfinished surfaces, and the beauty of structural honesty. Béton Brut brought together three Madrid-based photographers whose work finds poetry in the built environment, in the spaces between intention and erosion.",
        artist: {
            name: "Colectivo Gris",
            description: "Documentary photography collective based in Madrid.",
            siteHref: "#",
        },
        typeInfo: {
            title: "Group Exhibition",
            description: "Six-week photography show",
        },
        space: {
            title: "VNT Coffee_Gallery",
            description: "40m²",
        },
    },
};

export default async function EventPage({ params }: EventPageProps) {
    const { slug } = await params;
    const event = eventBySlug[slug];
    const eventSlugs = Object.keys(eventBySlug);
    const currentEventIndex = eventSlugs.indexOf(slug);
    const nextEventSlug =
        eventSlugs[(currentEventIndex + 1) % eventSlugs.length];
    const nextEvent = eventBySlug[nextEventSlug];

    if (!event) {
        notFound();
    }

    return (
        <div className="bg-black">
            {/* Header */}
            <div className="flex flex-row justify-between items-center p-4">
                <Link href={"/"}>
                    <Image
                        src={VNTlogo}
                        alt={"VntLogo"}
                        className="brightness-0 invert h-14 w-fit"
                    />
                </Link>
                <Link href="/events" className="text-2xl font-semibold text-white">
                    ← PAST EVENTS
                </Link>
            </div>

            {/* Bg image */}
            <div className="relative w-full overflow-hidden leading-none">
                <Image
                    src={ImagePlaceholder}
                    alt={event.title}
                    className="block h-[60vh] w-full object-cover"
                    priority
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black/90 to-transparent" />

                <div className="absolute bottom-4 left-4 bg-white p-4 lg:p-5 px-6 lg:min-w-[454px] text-black">
                    <h1 className="text-3xl lg:text-[44px] font-semibold uppercase text-center">
                        {event.title}
                    </h1>
                </div>
            </div>
            <div className="lg:flex lg:flex-row lg:p-4">
                <div className="p-2">
                    {/* Event description */}
                    <p className="mb-2 line text-base/8 text-white lg:w-[80%] lg:text-[24px] lg:leading-12 lg:mb-8">
                        {event.description}
                    </p>
                    {/* Image block */}
                    <div className="flex w-full flex-col gap-1 overflow-hidden lg:p-2 lg:pr-8">
                        <Image
                            src={ImagePlaceholder}
                            alt={event.title}
                            className="block h-60 lg:h-[450px] w-full object-cover"
                            priority
                        />
                        <div className="flex h-40 lg:h-[378px] w-full flex-row gap-1">
                            <Image
                                src={ImagePlaceholder}
                                alt={event.title}
                                className="block h-full min-w-0 flex-1 object-cover"
                                priority
                            />
                            <Image
                                src={ImagePlaceholder}
                                alt={event.title}
                                className="block h-full w-40 shrink-0 object-cover lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink"
                                priority
                            />
                        </div>
                    </div>
                </div>
                {/* EventInfo section */}
                <div className="flex flex-col gap-12 p-4 lg:mt-3 lg:min-w-[365px]">
                    <EventInfoBlock
                        label="Artist"
                        title={event.artist.name}
                        description={event.artist.description}
                        linkText="Visit Artist Site"
                        linkHref={event.artist.siteHref}
                    />
                    <EventInfoBlock
                        label="Type"
                        title={event.typeInfo.title}
                        description={event.typeInfo.description}
                    />
                    <EventInfoBlock
                        label="Space"
                        title={event.space.title}
                        description={event.space.description}
                    />

                    <EventInfoBlock
                        label="Want to show your work?"
                        title="We work with artists, designers, and brands."
                        linkText="COLLABORATE WITH US"
                        linkHref="https://www.instagram.com/vnt_madrid/"
                    />
                </div>
            </div>

            {/* Mobile next event button */}
            <div className="block bg-white p-4 text-black lg:hidden">
                <Link href={`/events/${nextEventSlug}`} className="">
                    <p className=" text-[14px] text-mist-500">Next Event</p>
                    <div className="flex flex-row items-center justify-between">
                        <p className="text-[24px] uppercase">
                            {nextEvent.title}
                        </p>
                        <p className="text-2xl">↗</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
