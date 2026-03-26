import Image from "next/image";
import BgConcrete from "@/public/images/BgConcrete.jpg";
import Founders from "@/public/images/Founders.jpg";

export default function FoundersSection() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-5 font-sans"
      style={{ backgroundImage: `url(${BgConcrete.src})` }}
    >
      <div className="bg-white text-black">
        <div className="p-4">
          <p className="font-semibold text-4xl text-center">THE_FOUNDERS</p>
        </div>
        <Image src={Founders} alt="VNT Logo" className="h-[260px] object-cover" />
        <div className="p-4 flex flex-col gap-4">
          <div>
            <p className="mb-1 text-lg font-medium">Eduardo Villalón Chafe</p>
            <p className="text-sm">
              Born in Valencia, Spain and founder of the renowned studio MUT
              Design, with a deep sensibility for materials, form, and
              function. His work bridges minimalism and emotion, focusing on
              creating experiences that feel both tactile and timeless.
            </p>
          </div>
          <div className="h-[1px] border border-gray-200" />
          <div>
            <p className="mb-1 text-lg font-medium">Fabien Peronnet</p>
            <p className="text-sm">
              French entrepreneur with a background in hospitality and
              communication. After running a creative agency in Paris, Fabien
              co-founded and opened in Valencia LA NOVIETA boutique hotel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
