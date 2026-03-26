import Link from "next/link";
import Image from "next/image";
import imagePlaceholder from "@/public/images/BgConcrete.jpg";
import TalkToUsForm from "./TalkToUsForm";
import VNTlogo from "@/public/VNT black logo.svg";

const events = [
  { slug: "beton-brut", title: "BÉTON BRUT" },
  { slug: "summer-opening", title: "Summer Opening" },
  { slug: "design-talk", title: "Design Talk" },
  { slug: "fashion-night", title: "Fashion Night" },
];

export default function EventsPage() {
  return (
    <main className="">
      <div className="flex flex-row justify-between items-center p-4 mb-24">
        <Link href={"/"}>
          <Image
            src={VNTlogo}
            alt={"VntLogo"}
            className="brightness-0 invert h-14 w-fit"
          />
        </Link>
        <p className="text-2xl font-semibold">PAST EVENTS</p>
      </div>
      <ul className="flex gap-4 overflow-x-auto whitespace-nowrap pb-2 mb-24">
        {events.map((event) => (
          <li key={event.slug} className="shrink-0 w-[300px]">
            <Link href={`/events/${event.slug}`}>
              <Image src={imagePlaceholder} alt="image holder" />
              <div className="p-5 bg-white text-black flex items-center justify-center">
                <p className="text-2xl font-semibold uppercase">
                  {event.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <TalkToUsForm />
    </main>
  );
}
