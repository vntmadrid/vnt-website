import Link from "next/link";
import Image from "next/image";
import VNTlogo from "@/public/VNT black logo.svg";
import ImagePlaceholder from "@/public/images/BgConcrete.jpg";
import EventInfoBlock from "@/app/components/events/EventInfoBlock";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";

type EventPageProps = {
    params: Promise<{ lang: 'en' | 'es'; slug: string }>;
};

export default async function EventPage(props: EventPageProps) {
    const params = await props.params;
    const lang = params.lang;
    const slug = params.slug;

    // Fetch the current event and also fetch adjacent events to calculate next event
    const query = `{
        "event": *[_type == "event" && slug.current == $slug][0] {
            "title": title[$lang],
            "description": description[$lang],
            "coverImageUrl": coverPhoto.asset->url,
            "artist": {
                "name": artist.name,
                "description": artist.description[$lang],
                "siteHref": artist.siteHref
            },
            "typeInfo": {
                "title": typeInfo.title[$lang],
                "description": typeInfo.description[$lang]
            },
            "space": space,
            "gallery": gallery[0...3].asset->url
        },
        "allEvents": *[_type == "event"] | order(_createdAt asc) {
            "slug": slug.current,
            "title": title[$lang]
        }
    }`;

    const data = await client.fetch(query, { slug, lang });
    
    if (!data || !data.event) {
        notFound();
    }

    const event = data.event;
    const allEvents = data.allEvents || [];
    
    let nextEventSlug = null;
    let nextEventTitle = null;

    if (allEvents.length > 1) {
        const currentIndex = allEvents.findIndex((e: { slug: string, title: string }) => e.slug === slug);
        if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % allEvents.length;
            nextEventSlug = allEvents[nextIndex].slug;
            nextEventTitle = allEvents[nextIndex].title;
        }
    }

    const galleryPhotos = event.gallery || [];
    const photo1 = galleryPhotos[0] || ImagePlaceholder;
    const photo2 = galleryPhotos[1] || ImagePlaceholder;
    const photo3 = galleryPhotos[2] || ImagePlaceholder;

    return (
        <div className="bg-black">
            {/* Header */}
            <div className="flex flex-row justify-between items-center p-4">
                <Link href={`/${lang}`}>
                    <Image
                        src={VNTlogo}
                        alt={"VntLogo"}
                        className="brightness-0 invert h-14 w-fit"
                    />
                </Link>
                <Link href={`/${lang}/events`} className="text-2xl font-semibold text-white">
                    ← PAST EVENTS
                </Link>
            </div>

            {/* Bg image */}
            <div className="relative w-full overflow-hidden leading-none">
                <Image
                    src={event.coverImageUrl || ImagePlaceholder}
                    alt={event.title || "Event Image"}
                    className="block h-[60vh] w-full object-cover"
                    priority
                    width={1920}
                    height={1080}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/90 to-transparent" />

                <div className="absolute bottom-4 left-4 bg-white p-4 lg:p-5 px-6 lg:min-w-[454px] text-black">
                    <h1 className="text-3xl lg:text-[44px] font-semibold uppercase text-center">
                        {event.title}
                    </h1>
                </div>
            </div>
            <div className="lg:flex lg:flex-row lg:p-4">
                <div className="p-2">
                    {/* Event description */}
                    <p className="mb-2 line text-base/8 text-white lg:w-[80%] lg:text-[24px] lg:leading-12 lg:mb-8 whitespace-pre-wrap">
                        {event.description}
                    </p>
                    {/* Image block */}
                    {galleryPhotos.length > 0 && (
                        <div className="flex w-full flex-col gap-1 overflow-hidden lg:p-2 lg:pr-8">
                            <Image
                                src={photo1}
                                alt={event.title}
                                className="block h-60 lg:h-[450px] w-full object-cover"
                                width={1200}
                                height={800}
                                priority
                            />
                            <div className="flex h-40 lg:h-[378px] w-full flex-row gap-1">
                                <Image
                                    src={photo2}
                                    alt={event.title}
                                    className="block h-full min-w-0 flex-1 object-cover"
                                    width={600}
                                    height={400}
                                    priority
                                />
                                <Image
                                    src={photo3}
                                    alt={event.title}
                                    className="block h-full w-40 shrink-0 object-cover lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink"
                                    width={400}
                                    height={400}
                                    priority
                                />
                            </div>
                        </div>
                    )}
                </div>
                {/* EventInfo section */}
                <div className="flex flex-col gap-12 p-4 lg:mt-3 lg:min-w-[365px]">
                    {event.artist?.name && (
                        <EventInfoBlock
                            label="Artist"
                            title={event.artist.name}
                            description={event.artist.description}
                            linkText={event.artist.siteHref ? "Visit Artist Site" : undefined}
                            linkHref={event.artist.siteHref ? event.artist.siteHref : undefined}
                        />
                    )}
                    {event.typeInfo?.title && (
                        <EventInfoBlock
                            label="Type"
                            title={event.typeInfo.title}
                            description={event.typeInfo.description}
                        />
                    )}
                    {event.space && (
                        <EventInfoBlock
                            label="Space"
                            title={event.space}
                            description={event.space === 'VNT Events_Space' ? '90m²' : '40m²'}
                        />
                    )}

                    <EventInfoBlock
                        label="Want to show your work?"
                        title="We work with artists, designers, and brands."
                        linkText="COLLABORATE WITH US"
                        linkHref="https://www.instagram.com/vnt_madrid/"
                    />
                </div>
            </div>

            {/* Mobile next event button */}
            {nextEventSlug && (
                <div className="block bg-white p-4 text-black lg:hidden">
                    <Link href={`/${lang}/events/${nextEventSlug}`} className="">
                        <p className=" text-[14px] text-gray-500">Next Event</p>
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-[24px] uppercase pr-4 truncate">
                                {nextEventTitle}
                            </p>
                            <p className="text-2xl">↗</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
