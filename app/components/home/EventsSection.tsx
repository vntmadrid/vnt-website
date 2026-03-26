import Image from "next/image";
import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";

const eventTitles = [
    "EVENT SPACE OPENssss",
    "DESIGN TALK",
    "ART SHOWCASE",
    "FASHION DAY",
    "QUARTERLY SHOW",
];

export default function EventsSection() {
    return (
        <div className="bg-gray-700 p-5 lg:p-8 font-sans overflow-x-auto">
            <div className="flex gap-4 lg:gap-6">
                {eventTitles.map((title) => (
                    <div
                        key={title}
                        className="bg-white text-black h-[500px] w-[300px] lg:h-[620px] lg:w-[470px] flex-shrink-0"
                    >
                        <div className="flex h-full flex-col items-center">
                            <div className="w-full min-w-0 p-3 lg:p-5">
                                <p className="w-full min-w-0 truncate text-center font-semibold text-2xl lg:text-5xl">
                                    {title}
                                </p>
                            </div>
                            <Image
                                className="h-full w-full object-cover"
                                src={ConceptStoreBg}
                                alt="event title"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
