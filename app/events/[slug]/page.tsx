import Link from "next/link";
import Image from "next/image";
import VNTlogo from "@/public/VNT black logo.svg";
import ImagePlaceholder from "@/public/images/BgConcrete.jpg";

import { notFound } from "next/navigation";

type EventPageProps = {
    params: Promise<{ slug: string }>;
};

const eventBySlug: Record<string, { title: string; description: string }> = {
    "summer-opening": {
        title: "SUMMER OPENING",
        description:
            "A one-night gathering shaped by heat, shadow, and saturated color — an opening built around movement, sound, and spontaneous encounters. Summer Opening brought together local artists and DJs in a space tuned for late light, raw textures, and the quiet tension between celebration and stillness.",
    },
    "design-talk": {
        title: "DESIGN TALK",
        description:
            "An intimate conversation on interior language, visual identity, and material culture — tracing how objects, surfaces, and proportions shape the way we move through space. Design Talk invited architects, creatives, and founders into a focused dialogue on process, restraint, and the emotional weight of form.",
    },
    "fashion-night": {
        title: "FASHION NIGHT",
        description:
            "An evening defined by silhouette, rhythm, and contrast — a live sequence of pop-up moments and runway gestures from guest brands working at the edge of craft and experimentation. Fashion Night transformed the gallery into a temporary stage where garments, bodies, and architecture moved in dialogue.",
    },
    "beton-brut": {
        title: "BÉTON BRUT",
        description:
            "A six-week exhibition drawing from the raw visual language of brutalist architecture — exposed concrete, unfinished surfaces, and the beauty of structural honesty. Béton Brut brought together three Madrid-based photographers whose work finds poetry in the built environment, in the spaces between intention and erosion.",
    },
};

export default async function EventPage({ params }: EventPageProps) {
    const { slug } = await params;
    const event = eventBySlug[slug];

    if (!event) {
        notFound();
    }

    return (
        <div className="">
            <div className="flex flex-row justify-between items-center p-4">
                <Link href={"/"}>
                    <Image
                        src={VNTlogo}
                        alt={"VntLogo"}
                        className="brightness-0 invert h-14 w-fit"
                    />
                </Link>
                <Link href="/events" className="text-2xl font-semibold">
                    PAST EVENTS
                </Link>
            </div>

            <div className="relative w-full overflow-hidden leading-none">
                <Image
                    src={ImagePlaceholder}
                    alt={event.title}
                    className="block h-[60vh] w-full object-cover"
                    priority
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black/90 to-transparent" />

                <div className="absolute bottom-4 left-4 bg-white p-4 px-6 text-black">
                    <h1 className="text-3xl font-semibold uppercase">
                        {event.title}
                    </h1>
                </div>
            </div>
            <div className="p-4">
                <p className="mb-2 line text-base/8">{event.description}</p>
                <div className="flex w-full flex-col gap-1 overflow-hidden">
                    <Image
                        src={ImagePlaceholder}
                        alt={event.title}
                        className="block h-60 w-full object-cover"
                        priority
                    />
                    <div className="flex w-full flex-row gap-1">
                        <Image
                            src={ImagePlaceholder}
                            alt={event.title}
                            className="block h-40 min-w-0 flex-1 object-cover"
                            priority
                        />
                        <Image
                            src={ImagePlaceholder}
                            alt={event.title}
                            className="block h-40 w-40 shrink-0 object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
