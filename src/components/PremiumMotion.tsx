"use client";

import {
    HTMLMotionProps,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    Variants,
} from "framer-motion";
import { ReactNode, useRef } from "react";

export const premiumSpring = {
    type: "spring",
    stiffness: 240,
    damping: 28,
    mass: 0.7,
} as const;

export const viewportReveal = {
    once: true,
    margin: "-12% 0px -12% 0px",
} as const;

export const blurRevealVariants: Variants = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: premiumSpring,
    },
};

export const cardRevealVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
        opacity: 1,
        y: 0,
        transition: premiumSpring,
    },
};

type TiltCardProps = HTMLMotionProps<"div"> & {
    children: ReactNode;
    depth?: number;
    glare?: boolean;
};

export function TiltCard({
    children,
    className = "",
    depth = 12,
    glare = true,
    onMouseMove,
    onMouseLeave,
    style,
    ...props
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [depth, -depth]), premiumSpring);
    const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-depth, depth]), premiumSpring);
    const glareX = useTransform(pointerX, [-0.5, 0.5], ["20%", "80%"]);
    const glareY = useTransform(pointerY, [-0.5, 0.5], ["20%", "80%"]);

    return (
        <motion.div
            ref={ref}
            className={`premium-tilt ${className}`}
            style={{
                rotateX: shouldReduceMotion ? 0 : rotateX,
                rotateY: shouldReduceMotion ? 0 : rotateY,
                transformStyle: "preserve-3d",
                ...style,
            }}
            whileHover={shouldReduceMotion ? undefined : { y: -8 }}
            transition={premiumSpring}
            onMouseMove={(event) => {
                onMouseMove?.(event);
                if (shouldReduceMotion || !ref.current) return;
                const rect = ref.current.getBoundingClientRect();
                pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
                pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
            }}
            onMouseLeave={(event) => {
                onMouseLeave?.(event);
                pointerX.set(0);
                pointerY.set(0);
            }}
            {...props}
        >
            {glare && (
                <motion.span
                    className="premium-tilt-glare"
                    style={{
                        background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2), transparent 36%)`,
                    }}
                />
            )}
            <div className="premium-tilt-content">{children}</div>
        </motion.div>
    );
}

export function Magnetic({
    children,
    className = "",
    strength = 0.22,
}: {
    children: ReactNode;
    className?: string;
    strength?: number;
}) {
    const ref = useRef<HTMLSpanElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, premiumSpring);
    const springY = useSpring(y, premiumSpring);

    return (
        <motion.span
            ref={ref}
            className={`inline-flex ${className}`}
            style={{ x: springX, y: springY }}
            onMouseMove={(event) => {
                if (shouldReduceMotion || !ref.current) return;
                const rect = ref.current.getBoundingClientRect();
                x.set((event.clientX - rect.left - rect.width / 2) * strength);
                y.set((event.clientY - rect.top - rect.height / 2) * strength);
            }}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
        >
            {children}
        </motion.span>
    );
}
