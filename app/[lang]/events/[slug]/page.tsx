import { Link } from "next-view-transitions";
import Image from "next/image";
import ImagePlaceholder from "@/public/images/BgConcrete.jpg";
import EventInfoBlock from "@/app/components/events/EventInfoBlock";
import EventsHeader from "@/app/components/events/EventsHeader";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";

export async function generateMetadata(props: {
    params: Promise<{ lang: "en" | "es"; slug: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const lang = params.lang;
    const slug = params.slug;

    const query = `*[_type == "event" && slug.current == $slug][0] {
        "title": title[$lang],
        "description": description[$lang]
    }`;
    const event = await client.fetch(query, { slug, lang });

    if (!event) return {};

    return {
        title: `${event.title} | Events | VNT Madrid`,
        description: event.description || "Event at VNT Madrid",
    };
}

type EventPageProps = {
    params: Promise<{ lang: "en" | "es"; slug: string }>;
};

export default async function EventPage(props: EventPageProps) {
    const params = await props.params;
    const lang = params.lang;
    const slug = params.slug;
    const t =
        lang === "es"
            ? {
                  eventImageAlt: "Imagen del evento",
                  artistLabel: "Artista",
                  visitArtistSite: "Visitar sitio del artista",
                  typeLabel: "Tipo",
                  spaceLabel: "Espacio",
                  durationLabel: "Duracion",
                  collaborateLabel: "Quieres mostrar tu trabajo?",
                  collaborateTitle:
                      "Trabajamos con artistas, disenadores y marcas.",
                  collaborateCta: "COLABORA CON NOSOTROS",
                  nextEventLabel: "Siguiente evento",
              }
            : {
                  eventImageAlt: "Event Image",
                  artistLabel: "Artist",
                  visitArtistSite: "Visit Artist Site",
                  typeLabel: "Type",
                  spaceLabel: "Space",
                  durationLabel: "Duration",
                  collaborateLabel: "Want to show your work?",
                  collaborateTitle:
                      "We work with artists, designers, and brands.",
                  collaborateCta: "COLLABORATE WITH US",
                  nextEventLabel: "Next event",
              };

    //   UNCOMMENT if they want vnt coffee gallery to be translated (i dont think they do but just in case :P )
    // const getSpaceLabel = (space: string | null) => {
    //     if (space === "VNT Events_Space") {
    //         return lang === "es" ? "Espacio de Eventos VNT" : "VNT Events Space";
    //     }
    //     if (space === "VNT Coffee_Gallery") {
    //         return lang === "es" ? "Galeria Cafe VNT" : "VNT Coffee Gallery";
    //     }
    //     return space;
    // };

    // Fetch the current event and also fetch adjacent events to calculate next event
    const query = `{
        "event": *[_type == "event" && slug.current == $slug][0] {
            "title": title[$lang],
            "description": description[$lang],
            "coverImageUrl": coverPhoto.asset->url,
            "duration": {
                "title": duration.title[$lang],
                "range": duration.range[$lang]
            },
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
            "gallery": gallery[0...3].asset->url,
            "products": eventProducts[]-> {
                _id,
                "title": title[$lang],
                price,
                stock,
                images,
                slug,
            }
        },
        "allEvents": *[_type == "event"] | order(_createdAt asc) {
            "slug": slug.current,
            "title": title[$lang],
            "eventType": typeInfo.title[$lang],
            "eventSpace": space
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
    let nextEventType = null;
    let nextEventSpace = null;

    if (allEvents.length > 1) {
        const currentIndex = allEvents.findIndex(
            (e: { slug: string; title: string }) => e.slug === slug,
        );
        if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % allEvents.length;
            nextEventSlug = allEvents[nextIndex].slug;
            nextEventTitle = allEvents[nextIndex].title;
            nextEventType = allEvents[nextIndex].eventType;
            nextEventSpace = allEvents[nextIndex].eventSpace;
        }
    }

    const galleryPhotos: string[] = (event.gallery || []).filter(Boolean);
    const hasSingleGalleryPhoto = galleryPhotos.length === 1;

    return (
        <div className="bg-black">
            <EventsHeader lang={lang} isDetailPage />

            {/* Bg image */}
            <div className="relative w-full overflow-hidden leading-none">
                <div
                    className="relative block h-[60vh] w-full"
                    style={{
                        viewTransitionName: `event-image-${slug.replace(/[^a-zA-Z0-9]/g, "-")}`,
                    }}
                >
                    <Image
                        src={event.coverImageUrl || ImagePlaceholder}
                        alt={event.title || t.eventImageAlt}
                        className="absolute inset-0 h-full w-full object-cover"
                        priority
                        width={1920}
                        height={1080}
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/90 to-transparent z-0" />
                </div>

                <div
                    className="absolute bottom-4 left-4 bg-white p-4 lg:p-5 px-6 lg:min-w-[454px] max-w-[90vw] text-black z-10"
                    style={{
                        viewTransitionName: `event-label-${slug.replace(/[^a-zA-Z0-9]/g, "-")}`,
                    }}
                >
                    <h1 className="text-3xl lg:text-[44px] font-semibold uppercase text-center">
                        {event.title}
                    </h1>
                </div>
            </div>
            <div className="lg:flex lg:flex-row lg:p-4">
                <div className="p-4 w-full">
                    {/* Event description */}
                    <p className="mb-2 line text-base/8 text-white lg:w-[80%] lg:text-[24px] lg:leading-12 lg:mb-8 whitespace-pre-wrap">
                        {event.description}
                    </p>
                    {/* Image block */}
                    {galleryPhotos.length > 0 && (
                        <div className="flex w-full flex-col gap-1 overflow-hidden lg:p-2 lg:pr-4">
                            {galleryPhotos[1] && !galleryPhotos[2] ? (
                                <div className="flex w-full h-72 lg:h-[520px] flex-row gap-1">
                                    <Image
                                        src={galleryPhotos[0]}
                                        alt={event.title}
                                        className="block h-full min-w-0 flex-1 object-cover"
                                        width={1200}
                                        height={800}
                                        priority
                                    />
                                    <Image
                                        src={galleryPhotos[1]}
                                        alt={event.title}
                                        className="block h-full w-[180px] sm:w-[220px] lg:w-[40%] xl:w-[30%] object-cover"
                                        width={450}
                                        height={800}
                                        priority
                                    />
                                </div>
                            ) : (
                                <Image
                                    src={galleryPhotos[0]}
                                    alt={event.title}
                                    className={`block h-60 w-full object-cover ${hasSingleGalleryPhoto ? "lg:h-[650px]" : "lg:h-[450px]"}`}
                                    width={1200}
                                    height={800}
                                    priority
                                />
                            )}

                            {galleryPhotos[1] && galleryPhotos[2] && (
                                <div className="flex h-40 lg:h-[378px] w-full flex-row gap-1">
                                    <Image
                                        src={galleryPhotos[1]}
                                        alt={event.title}
                                        className="block h-full min-w-0 flex-1 object-cover"
                                        width={600}
                                        height={400}
                                        priority
                                    />
                                    <Image
                                        src={galleryPhotos[2]}
                                        alt={event.title}
                                        className="block h-full w-40 shrink-0 object-cover lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink"
                                        width={400}
                                        height={400}
                                        priority
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* EventInfo section */}
                <div className="flex flex-col px-4 lg:mt-0 lg:w-[365px]">
                    {event.artist?.name && (
                        <EventInfoBlock
                            label={t.artistLabel}
                            title={event.artist.name}
                            description={event.artist.description}
                            linkText={
                                event.artist.siteHref
                                    ? t.visitArtistSite
                                    : undefined
                            }
                            linkHref={
                                event.artist.siteHref
                                    ? event.artist.siteHref
                                    : undefined
                            }
                        />
                    )}
                    {event.typeInfo?.title && (
                        <EventInfoBlock
                            label={t.typeLabel}
                            title={event.typeInfo.title}
                            description={event.typeInfo.description}
                        />
                    )}
                    {event.space && (
                        <EventInfoBlock
                            label={t.spaceLabel}
                            title={event.space}
                            description={
                                event.space === "VNT Events_Space"
                                    ? "90m²"
                                    : "40m²"
                            }
                        />
                    )}

                    {event.duration?.title && (
                        <EventInfoBlock
                            label={t.durationLabel}
                            title={event.duration?.title}
                            description={event.duration?.range}
                        />
                    )}

                    <EventInfoBlock
                        label={t.collaborateLabel}
                        title={t.collaborateTitle}
                        linkText={t.collaborateCta}
                        linkHref="https://www.instagram.com/vnt_madrid/"
                    />
                </div>
            </div>

            {/* --- EXCLUSIVE EVENT SHOP SECTION --- */}
            {event.products && event.products.length > 0 && (
                <div className="w-full border-t border-zinc-800 bg-black pt-8 pb-16">
                    <div className="px-4 lg:px-6 mb-8 flex justify-between items-end">
                        <h2 className="text-3xl font-semibold uppercase text-white">
                            {lang === "es"
                                ? "La Tienda del Evento"
                                : "Event Shop"}
                        </h2>
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-4 lg:px-6">
                        {event.products.map((product: any) => {
                            const isSoldOut = product.stock === 0;
                            const isLowStock =
                                product.stock > 0 && product.stock <= 5;

                            console.log("Product in /event slug:", product);

                            return (
                                <div
                                    key={product._id}
                                    className="flex-none w-[280px] lg:w-[320px] snap-start group"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-full aspect-[3/4] bg-zinc-900 mb-4 overflow-hidden">
                                        {product.images &&
                                            product.images.length > 0 && (
                                                <Image
                                                    src={urlFor(
                                                        product.images[0],
                                                    ).url()}
                                                    alt={product.title}
                                                    fill
                                                    className={`object-cover transition-transform duration-500 ${
                                                        isSoldOut
                                                            ? "opacity-50 grayscale"
                                                            : "group-hover:scale-105"
                                                    }`}
                                                />
                                            )}
                                        {/* Optional Overlays for Sold Out */}
                                        {isSoldOut && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 pointer-events-none">
                                                <span className="text-white uppercase font-semibold tracking-widest border border-white px-4 py-2">
                                                    {lang === "es"
                                                        ? "Agotado"
                                                        : "Sold Out"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex justify-between items-start text-white">
                                        <div>
                                            <h3 className="text-lg uppercase line-clamp-2 pr-2 leading-tight">
                                                {product.title}
                                            </h3>
                                            {/* Stock Status text */}
                                            {isSoldOut ? (
                                                <p className="text-sm text-zinc-500 uppercase mt-1">
                                                    {lang === "es"
                                                        ? "Sin stock"
                                                        : "Out of stock"}
                                                </p>
                                            ) : (
                                                <p
                                                    className={`text-sm uppercase mt-1  text-zinc-400`}
                                                >
                                                    {lang === "es"
                                                        ? `${product.stock} disponibles`
                                                        : `${product.stock} available`}
                                                    {isLowStock &&
                                                        (lang === "es"
                                                            ? " - ¡Casi agotado!"
                                                            : " - Low stock!")}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-lg whitespace-nowrap">
                                            €{product.price}
                                        </p>
                                    </div>

                                    {/* View Button */}
                                    <Link
                                        href={`/${lang}/shop/${product.slug.current}`}
                                        className={`block w-full mt-4 border py-3 uppercase text-md font-medium tracking-wider transition-colors text-center 
                                        ${
                                            isSoldOut
                                                ? "border-zinc-800 text-zinc-600 cursor-not-allowed pointer-events-none"
                                                : "border-white text-white hover:bg-white hover:text-black"
                                        }`}
                                    >
                                        {isSoldOut
                                            ? lang === "es"
                                                ? "Agotado"
                                                : "Sold Out"
                                            : lang === "es"
                                              ? "Ver"
                                              : "View"}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <Link
                href={`/${lang}/events/${nextEventSlug}`}
                className="group hidden lg:flex py-4 px-5 flex-row border-y border-zinc-600 text-zinc-500 transition-colors duration-200 hover:bg-white hover:text-black"
            >
                <div className="w-full flex items-center">
                    <p className="text-xl transition-all duration-200 group-hover:pl-2">
                        {t.nextEventLabel}
                    </p>
                </div>
                <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-row">
                        <div className="border-l border-zinc-600 mr-6 my-[8px] transition-colors duration-200 group-hover:border-black" />
                        <div>
                            <p className="text-2xl text-zinc-100 uppercase transition-colors duration-200 group-hover:text-black">
                                {nextEventTitle}
                            </p>
                            <div>
                                {nextEventType} · {nextEventSpace}
                            </div>
                        </div>
                    </div>
                    <ArrowRight className="-rotate-45" />
                </div>
            </Link>

            {/* Mobile next event button */}
            {nextEventSlug && (
                <div className="block bg-white p-4 text-black lg:hidden">
                    <Link
                        href={`/${lang}/events/${nextEventSlug}`}
                        className=""
                    >
                        <p className=" text-[14px] text-gray-500">
                            {t.nextEventLabel}
                        </p>
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
