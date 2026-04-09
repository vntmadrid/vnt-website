"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import VNTlogo from "@/public/VNT black logo.svg"

export default function ComingSoonPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white selection:bg-white selection:text-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0, 0.086, 0, 0.997] }}
                className="text-center px-4"
            >
                
                <Image src={VNTlogo} alt="VNT Logo" style={{ filter: "invert(1)" }} className="max-w-[30vw]"/>
       
                
     
            </motion.div>
        </main>
    );
}