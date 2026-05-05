import Image from "next/image";
import { Fragment } from "react";
import Founders from "@/public/images/Founders.jpg";
import FounderBG from "@/public/images/ConcreteFounderBG.jpg"

export interface FounderData {
    name?: string;
    description?: string;
}

export interface FoundersSectionData {
    sectionTitle?: string;
    backgroundImageUrl?: string;
    foundersImageUrl?: string;
    founders?: FounderData[];
}

const foundersFallbacks = [
    {
        name: "Eduardo Villalon Chafe",
        description: "Born in Valencia, Spain and founder of the renowned studio MUT Design, with a deep sensibility for materials, form, and function. His work bridges minimalism and emotion, focusing on creating experiences that feel both tactile and timeless."
    },
    {
        name: "Fabien Peronnet",
        description: "French entrepreneur with a background in hospitality and communication. After running a creative agency in Paris, Fabien co-founded and opened in Valencia LA NOVIETA boutique hotel."
    }
];

export default function FoundersSection({ data }: { data?: FoundersSectionData }) {
    const displayTitle = data?.sectionTitle || "THE_FOUNDERS";
    const bgUrl = data?.backgroundImageUrl || FounderBG.src;
    const foundersImgSrc = data?.foundersImageUrl || Founders;
    const displayFounders = data?.founders && data.founders.length > 0 ? data.founders : foundersFallbacks;

    return (
        <div
            className="flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-5 font-sans min-h-[720px] md:h-[576px]"
            style={{ backgroundImage: `url(${bgUrl})` }}
        >
            <div className="bg-white text-black md:flex md:flex-row md:items-stretch md:w-160 md:p-2.5">
                <div className="md:flex md:flex-col md:p-3 md:mr-4 md:min-w-[314px]">
                    <div className="p-4 md:p-0 md:mb-4">
                        <p className="text-center text-4xl md:text-3xl font-semibold md:text-left whitespace-pre-line">
                            {displayTitle}
                        </p>
                    </div>
                    <Image
                        src={foundersImgSrc}
                        alt="VNT founders"
                        width={1200}
                        height={900}
                        quality={100}
                        sizes="100vw"
                        className="h-65 w-full object-cover md:hidden"
                    />
                    <div className="flex flex-col gap-4 p-4 md:p-0">
                        {displayFounders.map((founder, index) => (
                            <Fragment key={founder.name || index}>
                                <div>
                                    <p className="mb-1 text-md md:text-[20px] font-medium">
                                        {founder.name}
                                    </p>
                                    <p className="text-sm md:text-[16px] whitespace-pre-line">
                                        {founder.description}
                                    </p>
                                </div>
                                {index < displayFounders.length - 1 && (
                                    <div className="h-px border border-gray-200" />
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
                {/* Desktop Img */}
                <Image
                    src={foundersImgSrc}
                    alt="VNT founders"
                    width={855}
                    height={1389}
                    quality={100}
                    sizes="285px"
                    className="hidden md:block md:w-[285px] h-auto object-cover"
                />
            </div>
        </div>
    );
}
