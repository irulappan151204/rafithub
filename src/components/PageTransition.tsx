"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const shouldReduceMotion = useReducedMotion();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial={
                    shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 18, filter: "blur(10px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                    shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: -12, filter: "blur(8px)" }
                }
                transition={{
                    duration: shouldReduceMotion ? 0 : 0.42,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
