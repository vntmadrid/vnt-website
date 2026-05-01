"use client";
import Link from "next/link";
import { Fragment } from "react";
import CollaborateOfferItem from "./CollaborateOfferItem";
import { useRouter } from "next/navigation";

export interface CollaborateOffer {
    title?: string;
    description?: string;
}

export interface CollaborateSectionData {
    sectionTitle?: string;
    offers?: CollaborateOffer[];
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
}

const collaborateOffersFallbacks = [
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

export default function CollaborateSection({ data }: { data?: CollaborateSectionData }) {
    const displayTitle = data?.sectionTitle || "COLLABORATE_";
    const displayOffers = data?.offers && data.offers.length > 0 ? data.offers : collaborateOffersFallbacks;
    const originalCtaTitle = (
        <>
            Got Something
            <br className="hidden lg:block" />
            {" "} in Mind?
        </>
    );
    const originalCtaDesc = (
        <>
            Drop us a message and let's see
            <br className="hidden lg:block" />
            what we can build together.
        </>
    );
    const ctaButtonText = data?.ctaButtonText || "Let's Talk";
    const router = useRouter();

    const handleCtaClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Go to /events, then scroll to the form anchor
        router.push("/events#contact-form-section");
    };

    return (
        <div id="collaborate" className="flex w-full bg-cover bg-center bg-no-repeat font-sans">
            <div className="w-full bg-white text-black">
                <div className="p-6 lg:p-12">
                    <p className="mb-4 lg:mb-10 text-4xl font-semibold lg:text-[58px] uppercase">
                        {displayTitle}
                    </p>
                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                        {displayOffers.map((offer, index) => (
                            <Fragment key={offer.title || index}>
                                <CollaborateOfferItem
                                    title={offer.title || ""}
                                    description={offer.description || ""}
                                />
                                {index < displayOffers.length - 1 && (
                                    <div className="h-px border border-gray-200 lg:h-auto lg:w-px" />
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
                <div className="bg-black px-4 py-6 sm:p-8 pb-7  text-white sm:flex sm:flex-row sm:justify-between sm:items-center">
                    <p className="mb-2 sm:mb-0 text-4xl md:max-w-[30%] md:text-[48px] font-semibold">
                        {data?.ctaTitle ? data.ctaTitle : originalCtaTitle}
                    </p>
                    <div className="flex flex-col sm:items-end">
                        <p className="mb-6 sm:mb-4 text-xl sm:max-w-[60%] sm:text-right">
                        {data?.ctaDescription ? data.ctaDescription : originalCtaDesc}
                        </p>

                        <Link
                            href={"/events#contact-form-section"}
                            onClick={handleCtaClick}
                            className="group flex flex-row justify-between border-4 border-white p-2 text-2xl font-semibold sm:w-fit sm:ml-auto transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
                        >
                            <p>{ctaButtonText}{" "}</p>
                            <p className="transition-transform duration-300 group-hover:translate-x-1">→</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
