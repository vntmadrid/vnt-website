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
            className="flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-5 font-sans lg:h-[576px]"
            style={{ backgroundImage: `url(${bgUrl})` }}
        >
            <div className="bg-white text-black lg:flex lg:flex-row lg:items-stretch lg:w-160 lg:p-2.5">
                <div className="lg:flex lg:flex-col lg:p-3 lg:mr-4 lg:min-w-[314px]">
                    <div className="p-4 lg:p-0 lg:mb-4">
                        <p className="text-center text-4xl lg:text-3xl font-semibold lg:text-left whitespace-pre-line">
                            {displayTitle}
                        </p>
                    </div>
                    <Image
                        src={foundersImgSrc}
                        alt="VNT founders"
                        width={1200}
                        height={900}
                        quality={100}
                        className="h-65 w-full object-cover lg:hidden"
                    />
                    <div className="flex flex-col gap-4 p-4 lg:p-0">
                        {displayFounders.map((founder, index) => (
                            <Fragment key={founder.name || index}>
                                <div>
                                    <p className="mb-1 text-lg lg:text-[20px] font-medium">
                                        {founder.name}
                                    </p>
                                    <p className="text-sm lg:text-[16px] whitespace-pre-line">
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
                    className="hidden lg:block lg:w-[285px] h-auto object-cover"
                />
            </div>
        </div>
    );
}
