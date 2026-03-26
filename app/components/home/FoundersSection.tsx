import Image from "next/image";
import Founders from "@/public/images/Founders.jpg";
import FounderBG from "@/public/images/ConcreteFounderBG.jpg"

export default function FoundersSection() {
    return (
        <div
            className="flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-5 font-sans lg:h-[576px]"
            style={{ backgroundImage: `url(${FounderBG.src})` }}
        >
            <div className="bg-white text-black lg:flex lg:flex-row lg:items-stretch lg:w-160 lg:p-2.5">
                <div className="lg:flex lg:flex-col lg:p-3 lg:mr-4 lg:min-w-[314px]">
                    <div className="p-4 lg:p-0 lg:mb-4">
                        <p className="text-center text-4xl lg:text-3xl font-semibold lg:text-left">
                            THE_FOUNDERS
                        </p>
                    </div>
                    <Image
                        src={Founders}
                        alt="VNT founders"
                        className="h-65 w-full object-cover lg:hidden"
                    />
                    <div className="flex flex-col gap-4 p-4 lg:p-0">
                        <div>
                            <p className="mb-1 text-lg lg:text-[20px] font-medium">
                                Eduardo Villalon Chafe
                            </p>
                            <p className="text-sm lg:text-[16px]">
                                Born in Valencia, Spain and founder of the
                                renowned studio MUT Design, with a deep
                                sensibility for materials, form, and function.
                                His work bridges minimalism and emotion,
                                focusing on creating experiences that feel both
                                tactile and timeless.
                            </p>
                        </div>
                        <div className="h-px border border-gray-200" />
                        <div>
                            <p className="mb-1 text-lg lg:text-[20px] font-medium">
                                Fabien Peronnet
                            </p>
                            <p className="text-sm lg:text-[16px]">
                                French entrepreneur with a background in
                                hospitality and communication. After running a
                                creative agency in Paris, Fabien co-founded and
                                opened in Valencia LA NOVIETA boutique hotel.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Desktop Img */}
                <Image
                    src={Founders}
                    alt="VNT founders"
                    width={285}
                    height={463}
                    className="hidden lg:block lg:w-[285px] h-auto object-cover"
                />
            </div>
        </div>
    );
}
