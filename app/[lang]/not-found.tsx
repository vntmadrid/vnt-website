"use client";

import EventsHeader from "@/app/components/events/EventsHeader";
import { Link } from "next-view-transitions";
import Image from "next/image";
import VNTlogo from "@/public/VNT black logo.svg";
import { useParams } from "next/navigation";

export default function NotFound() {
    const params = useParams();
    const lang = (params?.lang as "en" | "es") || "en";

    const t =
        lang === "es"
            ? {
                  title: "404",
                  message: "Página no encontrada :(",
                  back: "Volver al inicio",
              }
            : {
                  title: "404",
                  message: "Page Not Found :(",
                  back: "Back to Home",
              };

    return (
        <main className="bg-black text-white min-h-screen overflow-x-hidden flex flex-col">
            <div className="p-5 flex flex-row justify-center md:justify-start">
                <Link href={`/${lang}`}>
                    <Image
                        src={VNTlogo}
                        alt={"VntLogo"}
                        className="brightness-0 invert w-fit h-14 lg:h-16"
                    />
                </Link>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-20">
                <div className="w-full max-w-2xl border-dashed border-zinc-800 rounded-sm py-20 flex flex-col items-center justify-center">
                    <h1 className="text-gray-400 uppercase tracking-wider text-4xl lg:text-6xl font-medium mb-4">
                        {t.title}
                    </h1>
                    <p className="text-zinc-300 text-xl lg:text-2xl font-light mb-8 text-center uppercase tracking-wide">
                        {t.message}
                    </p>
                    <div className="h-px w-12 bg-zinc-800 mb-8" />
                    <Link
                        href={`/${lang}`}
                        className="text-white hover:text-zinc-400 transition-colors uppercase tracking-[0.2em] text-sm border-b border-white pb-1"
                    >
                        {t.back}
                    </Link>
                </div>
            </div>
        </main>
    );
}
