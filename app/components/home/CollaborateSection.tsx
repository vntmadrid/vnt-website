import Link from "next/link";
import { Fragment } from "react";
import CollaborateOfferItem from "./CollaborateOfferItem";

const collaborateOffers = [
    {
        title: "Pop-up Experiences",
        description:
            "From two days to four weeks, take over the space and make it yours. Designed for fashion, fragrance, and lifestyle brands with something to say.",
    },
    {
        title: "Private Events",
        description:
            "From press launches to intimate tastings, VNT offers a refined backdrop for moments that deserve more than a generic venue.",
    },
    {
        title: "Exhibitions & Installations",
        description:
            "Show your collection where design, coffee, and community already meet. Our gallery program is built for work worth seeing.",
    },
];

export default function CollaborateSection() {
    return (
        <div className="flex w-full bg-cover bg-center bg-no-repeat font-sans">
            <div className="w-full bg-white text-black">
                <div className="p-6 lg:p-12">
                    <p className="mb-4 lg:mb-10 text-4xl font-semibold lg:text-[58px]">
                        COLLABORATE_
                    </p>
                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                        {collaborateOffers.map((offer, index) => (
                            <Fragment key={offer.title}>
                                <CollaborateOfferItem
                                    title={offer.title}
                                    description={offer.description}
                                />
                                {index < collaborateOffers.length - 1 && (
                                    <div className="h-px border border-gray-200 lg:h-auto lg:w-px" />
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
                <div className="bg-black px-4 py-6 lg:p-8 pb-7  text-white lg:flex lg:flex-row lg:justify-between lg:items-center">
                    <p className="mb-2 lg:mb-0 text-4xl lg:text-[48px] font-semibold">
                        Got Something
                        <br className="hidden lg:block" />
                        {" "} in Mind?
                    </p>
                    <div className="">
                        <p className="mb-6 lg:mb-4 text-xl lg:text-right">
                            Drop us a message and let's see
                            <br className="hidden lg:block" />
                            what we can build together.
                        </p>

                        <Link
                            href={"events"}
                            className="flex flex-row justify-between border-4 p-2 text-2xl font-semibold lg:w-fit lg:ml-auto"
                        >
                            <p>Let's Talk </p>
                            <p>→</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
