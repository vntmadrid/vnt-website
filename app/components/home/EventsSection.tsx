import Image from "next/image";
import ConceptStoreBg from "@/public/images/ConceptStoreBG.png";

const eventTitles = [
  "EVENT SPACE OPEN",
  "DESIGN TALK",
  "ART SHOWCASE",
  "FASHION DAY",
  "QUARTERLY SHOW",
];

export default function EventsSection() {
  return (
    <div className="h-[550px] bg-gray-700 p-5 font-sans overflow-x-auto">
      <div className="flex gap-4">
        {eventTitles.map((title) => (
          <div
            key={title}
            className="bg-white text-black h-[500px] w-[300px] flex-shrink-0"
          >
            <div className="flex flex-col items-center h-full">
              <div className="p-3">
                <p className="font-semibold text-2xl">{title}</p>
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
