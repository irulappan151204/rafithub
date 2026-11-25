"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const shouldReduceMotion = useReducedMotion();
    const isFirstMount = useRef(true);

    useEffect(() => {
        isFirstMount.current = false;
    }, []);

    return (
        <motion.div
            key={pathname}
            initial={
                shouldReduceMotion || isFirstMount.current
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 12 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.28,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
