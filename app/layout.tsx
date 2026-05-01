import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
    themeColor: "#000000",
};

export const metadata: Metadata = {
    title: "VNT Madrid",
    description: "The official website for VNT Madrid",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ViewTransitions>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-black`}
                >
                    {children}
                    <Analytics />
                    <SpeedInsights />
                </body>
            </html>
        </ViewTransitions>
    );
}
