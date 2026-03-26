import Image from "next/image";
import VntLogo from "@/public/VNT black logo.svg";
import InitialArtwork from "@/public/images/artwork.jpg";
import BgConcrete from "@/public/images/BgConcrete.jpg";

export default function IntroSection() {
    return (
        <div
            className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-5 font-sans"
            style={{ backgroundImage: `url(${BgConcrete.src})` }}
        >
            <div className="bg-white text-black flex flex-row items-center lg:p-6 lg:gap-6">
                {/* left side (desktop only) */}
                <div className="hidden lg:block text-center w-[200px]">
                    <p className="text-[20px] font-semibold mb-2">
                        VNT COFFEE_GALLERY
                    </p>
                    <p className="text-[16px]">
                        a space where design, art, and specialty coffee come
                        together. Located in a former electricity house, VNT
                        coffee_gallery was conceived as a living gallery a place
                        where creativity, craftsmanship, and community naturally
                        connect.
                    </p>
                </div>
                {/* center div */}
                <div className="lg:max-w-[420px]">
                    {/* Logo */}
                    <div className="p-3 lg:p-0 lg:mb-3">
                        <Image
                            src={VntLogo}
                            alt="VNT Logo"
                            className="h-10 lg:h-[76px]"
                        />
                    </div>
                    {/* Center img */}
                    <Image
                        src={InitialArtwork}
                        alt="Initial artwork"
                        className="w-auto h-[420px] object-cover"
                    />
                    {/* Bottom text */}
                    {/* Mobile version */}
                    <div className="block lg:hidden p-3">
                        <p>Built in a former electricity house.</p>
                        <p className="mb-3">Still generating something.</p>
                        <div className="flex flex-row justify-between border-t border-gray-300 pt-3 text-sm">
                            <div>
                                <p>Calle Novicidad 4</p>
                                <p>Madrid</p>
                            </div>
                            <p> Explore ↓</p>
                        </div>
                    </div>

                    {/* Desktop version (artwork description) */}
                    <div className="hidden lg:block text-center mt-5 text-sm">
                        <p>details about artpiece</p>
                    </div>
                </div>
                {/* right side (desktop only) */}
                <div className="hidden lg:block text-center w-[200px]">
                    <p className="text-[20px] font-semibold mb-2">
                        VNT CONCEPT_STORE
                    </p>
                    <p className="text-[16px]">
                        A 90 m² hybrid space conceived as a living platform for
                        brands and creators. Hosting pop-ups, exhibitions,
                        launches, talks, and gatherings, VNT+ offers a flexible
                        environment where ideas, products, and communities meet
                        through shared sensibilities.
                    </p>
                </div>
            </div>
        </div>
    );
}
