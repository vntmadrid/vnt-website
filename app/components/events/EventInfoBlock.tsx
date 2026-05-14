"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type EventInfoBlockProps = {
    label: string;
    title: string;
    description?: string;
    linkText?: string;
    linkHref?: string;
};

export default function EventInfoBlock({
    label,
    title,
    description,
    linkText,
    linkHref,
}: EventInfoBlockProps) {
    const router = useRouter()
    const handleCtaClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Go to /events, then scroll to the form anchor
        router.push("/events#contact-form-section");
    };
    const isInternalLink =
        linkHref && !/^([a-z][a-z0-9+.-]*:)?\/\//i.test(linkHref) === false
            ? false
            : !linkHref?.startsWith("http");
    const resolvedHref =
        linkHref && !/^([a-z][a-z0-9+.-]*:)?\/\//i.test(linkHref)
            ? `https://${linkHref}`
            : linkHref;

    return (
        <div className="border-b border-mist-800 py-8 lg:py-12">
            <p className="text-[14px] text-mist-500 leading-4">{label}</p>
            <p className="text-[20px] text-mist-100 mb-.5">{title}</p>
            {description ? (
                <p className="text-[16px] text-mist-300">{description}</p>
            ) : null}
            {linkText && resolvedHref ? (
                isInternalLink ? (
                    <button
                        onClick={handleCtaClick}
                        className="text-[16px] underline text-mist-400 bg-none border-none cursor-pointer"
                    >
                        {linkText} {"→"}
                    </button>
                ) : (
                    <Link
                        href={resolvedHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[16px] underline text-mist-400"
                    >
                        {linkText} {"→"}
                    </Link>
                )
            ) : null}
        </div>
    );
}
