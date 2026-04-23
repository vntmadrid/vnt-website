import Link from "next/link";
import Image from "next/image";
import imagePlaceholder from "@/public/images/BgConcrete.jpg";
import TalkToUsForm from "./TalkToUsForm";
import VNTlogo from "@/public/VNT black logo.svg";
import { client } from "@/sanity/lib/client";

export default async function EventsPage(props: { params: Promise<{ lang: 'en' | 'es' }> }) {
    const params = await props.params;
    const lang = params.lang;

    const query = `*[_type == "event"] | order(_createdAt desc){
        "slug": slug.current,
        "title": title[$lang],
        "coverImageUrl": coverPhoto.asset->url
    }`;

    const sanityEvents = await client.fetch(query, { lang });
    const events = sanityEvents || [];

    return (
        <main className="bg-black text-white min-h-screen">
            <div className="flex flex-row justify-between items-center p-4 mb-24">
                <Link href={`/${lang}`}>
                    <Image
                        src={VNTlogo}
                        alt={"VntLogo"}
                        className="brightness-0 invert h-14 w-fit"
                    />
                </Link>
                <p className="text-2xl font-semibold">PAST EVENTS</p>
            </div>
            
            {events.length > 0 ? (
                <ul className="flex gap-4 overflow-x-auto whitespace-nowrap pb-2 mb-24 px-4">
                    {events.map((event: { slug: string, title: string, coverImageUrl: string }) => (
                        <li key={event.slug} className="shrink-0 w-[300px]">
                            <Link href={`/${lang}/events/${event.slug}`}>
                                <div className="relative h-94 w-full">
                                    <Image fill className="object-cover" src={event.coverImageUrl || imagePlaceholder} alt={event.title} />
                                </div>
                                <div className="p-5 bg-white text-black flex items-center justify-center">
                                    <p className="text-2xl font-semibold uppercase line-clamp-2 text-center text-balance">
                                        {event.title}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 mx-4 mb-24 min-h-[300px] border-dashed rounded-sm">
                    <p className="text-gray-400 uppercase tracking-wider text-2xl font-medium mb-2">No Past Events</p>
                    <p className="text-gray-600 text-lg">Stay tuned for future updates.</p>
                </div>
            )}

            <div className="flex justify-center px-4">
                <div className="w-full lg:w-1/3">
                    <TalkToUsForm />
                </div>
            </div>
        </main>
    );
}
