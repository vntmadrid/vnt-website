import Image from "next/image";
import VntLogo from "@/public/VNT black logo.svg";

export default function SiteFooterSection() {
    return (
        <footer>
            <div className="p-12 lg:flex lg:flex-row lg:justify-between bg-black">
                <Image
                    src={VntLogo}
                    alt="Vnt Logo"
                    className="brightness-0 invert w-44 h-auto mb-6"
                />
                <div className="flex flex-col gap-5">
                    <a
                        href="https://maps.app.goo.gl/k5omgd39GdyZoNmy8?g_st=ic"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p className="mb-1 text-white">Location</p>
                        <p className="text-gray-400">
                            C. Noviciado 4, 28015 Madrid
                        </p>
                    </a>
                    <div>
                        <p className="mb-1 text-white">Hours</p>
                        <p className="text-gray-400">
                            Tuesday – Sunday: 10:00 – 19:00
                        </p>
                    </div>
                    <a href="mailto:vnt.madrid@gmail.com">
                        <p className="mb-1 text-white">Email</p>
                        <p className="text-gray-400">vnt.madrid@gmail.com</p>
                    </a>
                </div>
            </div>
        </footer>
    );
}
