import Image from "next/image";
import VntLogo from "@/public/VNT black logo.svg";

export interface SiteFooterData {
    logoUrl?: string;
    locationLabel?: string;
    locationText?: string;
    locationLink?: string;
    hoursLabel?: string;
    hoursText?: string;
    emailLabel?: string;
    emailText?: string;
}

export default function SiteFooterSection({
    data,
    lang,
}: {
    data?: SiteFooterData;
    lang: "en" | "es";
}) {
    const logoSrc = data?.logoUrl || VntLogo;
    const locationLabel =
        data?.locationLabel || (lang === "es" ? "Ubicacion" : "Location");
    const locationText = data?.locationText || "C. Noviciado 4, 28015 Madrid";
    const locationLink =
        data?.locationLink ||
        "https://maps.app.goo.gl/k5omgd39GdyZoNmy8?g_st=ic";

    const hoursLabel =
        data?.hoursLabel || (lang === "es" ? "Horario" : "Hours");
    const hoursText =
        data?.hoursText ||
        (lang === "es"
            ? "Martes – Domingo: 10:00 – 19:00"
            : "Tuesday – Sunday: 10:00 – 19:00");

    const emailLabel = data?.emailLabel || (lang === "es" ? "Correo" : "Email");
    const emailText = data?.emailText || "vnt.madrid@gmail.com";

    const isRemoteLogo = typeof logoSrc === "string";

    return (
        <footer>
            <div className="p-12 sm:flex sm:flex-row sm:justify-between items-center bg-black">
                <div className="sm:flex sm:flex-col sm:justify-center sm:items-center gap-4 sm:mt-12">
                    {isRemoteLogo ? (
                        <Image
                            src={logoSrc}
                            alt="Vnt Logo"
                            width={176}
                            height={50}
                            quality={100}
                            className="brightness-0 invert w-44 h-auto mb-6"
                        />
                    ) : (
                        <Image
                            src={VntLogo}
                            alt="Vnt Logo"
                            className="brightness-0 invert w-44 h-auto mb-6"
                        />
                    )}
                    <p className="text-zinc-500 text-sm hidden sm:block">
                        {lang === "es" ? "Sitio por" : "Website by"}{" "}
                        <a
                            href="http://www.nichita.dev"
                            target="_blank"
                            className="underline text-slate-500 hover:text-blue-400 transition-colors duration-150"
                        >
                            Nichita
                        </a>
                    </p>
                </div>
                <div className="flex flex-col gap-5">
                    <a
                        href={locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p className="mb-1 text-white">{locationLabel}</p>
                        <p className="text-gray-400 whitespace-pre-line">
                            {locationText}
                        </p>
                    </a>
                    <div>
                        <p className="mb-1 text-white">{hoursLabel}</p>
                        <p className="text-gray-400 whitespace-pre-line">
                            {hoursText}
                        </p>
                    </div>
                    <a href={`mailto:${emailText}`}>
                        <p className="mb-1 text-white">{emailLabel}</p>
                        <p className="text-gray-400">{emailText}</p>
                    </a>
                    <p className="text-zinc-500 text-sm block sm:hidden mt-6">
                        {lang === "es" ? "Sitio por" : "Website by"}{" "}
                        <a
                            href="http://www.nichita.dev"
                            target="_blank"
                            className="underline"
                        >
                            Nichita
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
