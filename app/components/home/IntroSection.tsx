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
      <div className="bg-white text-black">
        <div className="p-3">
          <Image src={VntLogo} alt="VNT Logo" className="h-10" />
        </div>
        <Image src={InitialArtwork} alt="VNT Logo" className="" />

        <div className="p-3">
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
      </div>
    </div>
  );
}
