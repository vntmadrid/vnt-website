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

export default function SiteFooterSection({ data }: { data?: SiteFooterData }) {
    const logoSrc = data?.logoUrl || VntLogo;
    const locationLabel = data?.locationLabel || "Location";
    const locationText = data?.locationText || "C. Noviciado 4, 28015 Madrid";
    const locationLink = data?.locationLink || "https://maps.app.goo.gl/k5omgd39GdyZoNmy8?g_st=ic";

    const hoursLabel = data?.hoursLabel || "Hours";
    const hoursText = data?.hoursText || "Tuesday – Sunday: 10:00 – 19:00";

    const emailLabel = data?.emailLabel || "Email";
    const emailText = data?.emailText || "vnt.madrid@gmail.com";

    const isRemoteLogo = typeof logoSrc === 'string';

    return (
        <footer>
            <div className="p-12 lg:flex lg:flex-row lg:justify-between bg-black">
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
                </div>
            </div>
        </footer>
    );
}
