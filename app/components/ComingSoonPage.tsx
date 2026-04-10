"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import VNTlogo from "@/public/VNT black logo.svg";
import DarkVeil from "@/components/DarkVeil";
import BorderGlow from "@/components/BorderGlow";
import InstagramIcon from "./InstagramIcon";
import MapPinIcon from "./MapPinIcon";

export default function ComingSoonPage() {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* BACKGROUND LAYER */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute inset-0 z-0"
            >
                <DarkVeil
                    hueShift={232}
                    noiseIntensity={0.03}
                    scanlineIntensity={0}
                    speed={1}
                    scanlineFrequency={0.5}
                    warpAmount={0.4}
                    resolutionScale={1}
                />
            </motion.div>

            {/* FOREGROUND OVERLAY */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    <BorderGlow
                        edgeSensitivity={30}
                        glowColor="40 120 70"
                        backgroundColor="#000000"
                        borderRadius={0}
                        glowRadius={40}
                        glowIntensity={1}
                        coneSpread={13}
                        animated
                        colors={["#FF8250", "#e68600", "#38bdf8"]}
                    >
                        <div className="pointer-events-auto flex flex-col items-center bg-black p-6 min-w-[300px]">
                            <Image
                                src={VNTlogo}
                                alt="VNT Madrid"
                                width={200}
                                height={100}
                                className="invert"
                            />
                            <motion.div
                                className="flex flex-col items-center justify-start w-full gap-0 lg:gap-6"
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{
                                    duration: 1.2,
                                    ease: [0.551, 0.245, 0, 0.996],
                                    delay: 1.2,
                                }}
                            >
                                <div className="h-0 w-full shrink-0"></div>
                                <div className="hidden lg:flex flex-col lg:flex-row text-gray-400 lg:gap-4 text-base lg:text-xl border-y border-gray-600 py-3 px-1 mt-4 lg:mt-0">
                                    <p>COFFEE_GALLERY</p>
                                    <p>EVENTS_SPACE</p>
                                </div>
                                <h1 className="text-white text-3xl/10 lg:text-5xl/16 font-medium mt-6 mb-10 lg:mt-6 lg:mb-12 text-center">
                                    Currently in <br />
                                    the making.
                                    <p className="text-gray-600 text-sm mt-1 font-normal">
                                        Website releasing soon.
                                    </p>
                                </h1>
                                <div className="flex flex-row justify-between w-full items-end mt-4 lg:mt-0">
                                    <div className="h-[28px] lg:h-[24px] flex flex-row gap-3 text-gray-500 mb-2">
                                        <a
                                            href="https://www.instagram.com/vnt_madrid/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-full"
                                        >
                                            <InstagramIcon className="w-auto h-full hover:text-white transition-colors cursor-pointer" />
                                        </a>
                                        <a
                                            href="https://maps.app.goo.gl/sYUHfQQohmJNknNRA"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-full"
                                        >
                                            <MapPinIcon className="w-auto h-full hover:text-white transition-colors cursor-pointer" />
                                        </a>
                                    </div>
                                    <div className="text-gray-500 text-sm lg:text-lg">
                                        <p>Designed & built by</p>
                                        <motion.a
                                            href="https://nichita.dev"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex justify-end items-center cursor-pointer hover:underline underline-offset-[5px] decoration-1 hover:brightness-125 transition-all"
                                            animate={{
                                                color: [
                                                    "#FF8250",
                                                    "#e64900",
                                                    "#e68600",
                                                    "#FF8250",
                                                ],
                                            }}
                                            transition={{
                                                duration: 12,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        >
                                            Nichita
                                            <span className="overflow-hidden transition-all duration-300 ease-out max-w-0 opacity-0 group-hover:max-w-[3em] group-hover:opacity-100">
                                                .dev
                                            </span>
                                        </motion.a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </BorderGlow>
                </div>
            </div>
        </div>
    );
}
