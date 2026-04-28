import TalkToUsForm from "./TalkToUsForm";
import { client } from "@/sanity/lib/client";
import EventsHeader from "@/app/components/events/EventsHeader";
import EventsCarousel from "./EventsCarousel";
import ScrollToContact from "@/app/components/events/ScrollToContact";

export default async function EventsPage(props: {
    params: Promise<{ lang: "en" | "es" }>;
}) {
    const params = await props.params;
    const lang = params.lang;
    const t =
        lang === "es"
            ? {
                  noEventsTitle: "No hay eventos pasados",
                  noEventsBody: "Vuelve pronto para futuras actualizaciones.",
                  formLead: "Quieres colaborar con VNT?",
              }
            : {
                  noEventsTitle: "No Past Events",
                  noEventsBody: "Stay tuned for future updates.",
                  formLead: "Want to collaborate with VNT?",
              };

    const query = `*[_type == "event"] | order(_createdAt desc){
        "slug": slug.current,
        "title": title[$lang],
        "coverImageUrl": coverPhoto.asset->url
    }`;

    const sanityEvents = await client.fetch(query, { lang });
    const events = sanityEvents || [];

    return (
        <main className="bg-black text-white min-h-screen overflow-x-hidden">
            <EventsHeader lang={lang} />

            <div className="h-[90vh] mb-4 flex items-center">
                {events.length > 0 ? (
                    <EventsCarousel lang={lang} events={events} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 mx-4 mb-24 min-h-[300px] border-dashed rounded-sm">
                        <p className="text-gray-400 uppercase tracking-wider text-2xl font-medium mb-2">
                            {t.noEventsTitle}
                        </p>
                        <p className="text-gray-600 text-lg">
                            {t.noEventsBody}
                        </p>
                    </div>
                )}
            </div>

            <div className="mx-4 lg:mx-auto lg:max-w-screen-xl border-b border-zinc-800">
                {/* <p className="text-zinc-300 uppercase tracking-wide text-sm">{t.formLead}</p> */}
            </div>

            <div id="contact-form-section" className="flex flex-row items-center justify-center px-4 lg:px-6 pt-16 lg:pt-30 pb-10 lg:pb-30">
                <TalkToUsForm lang={lang} />
            </div>

            <ScrollToContact lang={lang} />
        </main>
    );
}
