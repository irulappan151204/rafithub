"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AmbientScene() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="site-atmosphere" aria-hidden="true">
            <motion.div
                className="atmosphere-ribbon atmosphere-ribbon-one"
                animate={
                    shouldReduceMotion
                        ? undefined
                        : {
                            x: ["-8%", "6%", "-8%"],
                            y: ["0%", "4%", "0%"],
                            opacity: [0.48, 0.7, 0.48],
                        }
                }
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="atmosphere-ribbon atmosphere-ribbon-two"
                animate={
                    shouldReduceMotion
                        ? undefined
                        : {
                            x: ["8%", "-4%", "8%"],
                            y: ["2%", "-5%", "2%"],
                            opacity: [0.42, 0.64, 0.42],
                        }
                }
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="atmosphere-grid" />
            <div className="atmosphere-vignette" />
        </div>
    );
}
