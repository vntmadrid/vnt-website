import Image from "next/image";
import VntLogo from "@/public/VNT black logo.svg";
import InitialArtwork from "@/public/images/artwork.jpg";
import BgConcrete from "@/public/images/BgConcrete.jpg";
import CoffeeGalleryBG from "@/public/images/CoffeeGalleryBg.png";
import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";

export default function Home() {
  return (
    <>
      {/* Intro section */}
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
      {/* CoffeeGallery section */}
      <div
        className="flex min-h-screen items-end justify-center bg-cover bg-center bg-no-repeat p-5 font-sans"
        style={{ backgroundImage: `url(${CoffeeGalleryBG.src})` }}
      >
        <div className="bg-white text-black">
          <div className="p-3">
            <p>Coffee_gallery</p>
            <p className="mb-3 text-xl">
              The smell of coffee. The pull of art. A space that was always
              meant to feel like this.
            </p>
            <div className="flex flex-row justify-between border-t border-gray-300 pt-3 text-sm items-center">
              <div className="max-w-[50%]">
                <p>
                  The building used to generate electricity. We think it still
                  does.
                </p>
              </div>
              <div className="p-1 px-2 border-2 text-md font-bold">
                <p> View Menu →</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept store */}
      <div
        className="flex min-h-screen items-end justify-center bg-cover bg-center bg-no-repeat p-5 font-sans"
        style={{ backgroundImage: `url(${ConceptStoreBg.src})` }}
      >
        <div className="bg-white text-black">
          <div className="p-3">
            <p>Concept_store</p>
            <p className="mb-3 text-xl">
              Every visit, a different world. Design, fashion, and art,
              thoughtfully arranged, always evolving.
            </p>
            <div className="flex flex-row justify-between border-t border-gray-300 pt-3 mb-1 text-sm items-center">
              <p>90m² of rotating design, fashion, and art.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
