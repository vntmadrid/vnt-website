"use client";

import React, { useEffect, useState } from "react";

interface ScrollToContactProps {
    lang: "en" | "es";
}

const ScrollToContact: React.FC<ScrollToContactProps> = ({ lang }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When the contact form section is visible, hide the button
                setIsVisible(!entry.isIntersecting);
            },
            {
                threshold: 0.1, // Trigger when 10% of the form is visible
            },
        );

        const element = document.getElementById("contact-form-section");
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    const handleClick = () => {
        const element = document.getElementById("contact-form-section");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const text = lang === "es" ? "CONTÁCTANOS" : "CONTACT US";

    return (
        <button
            onClick={handleClick}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-white text-black px-6 py-4 hover:bg-zinc-200 transition-all duration-500 group ${
                isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-95 pointer-events-none"
            }`}
        >
            <span className="text-sm font-medium">{text}</span>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                className="transform group-hover:translate-y-1 transition-transform duration-200"
            >
                <path d="M7 13l5 5 5-5M12 6v12" />
            </svg>
        </button>
    );
};

export default ScrollToContact;
