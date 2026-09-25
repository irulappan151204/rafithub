"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

interface SmoothScrollProps {
    children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Skip smooth-scroll hijacking entirely on touch devices —
        // native momentum scrolling is smoother and far cheaper there.
        const isFinePointer =
            typeof window !== "undefined" &&
            window.matchMedia("(pointer: fine)").matches;

        if (!isFinePointer) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
        });

        lenisRef.current = lenis;
        let frameId: number;

        function raf(time: number) {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
        }

        frameId = requestAnimationFrame(raf);

        // Sync Lenis scroll position with framer-motion's useScroll.
        // framer-motion's useScroll reads window.scrollY on each frame via a
        // ResizeObserver / scroll event listener pair. Dispatching a synthetic
        // "scroll" event on the window each time Lenis advances its virtual
        // position keeps framer-motion's internal tracker in sync so parallax
        // transforms follow the Lenis easing rather than lagging behind it.
        const syncFramerMotion = () => {
            window.dispatchEvent(new Event("scroll", { bubbles: true }));
        };
        lenis.on("scroll", syncFramerMotion);

        // Don't burn CPU animating scroll while the tab is hidden.
        const handleVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(frameId);
            } else {
                frameId = requestAnimationFrame(raf);
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            lenis.off("scroll", syncFramerMotion);
            cancelAnimationFrame(frameId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // Reset scroll position on route change via Lenis (correct path).
    // Direct window.scrollTo is intentionally NOT called here — it would
    // conflict with Lenis's virtual scroll position and cause a flash.
    useEffect(() => {
        const resetScroll = () => {
            if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true, force: true });
            } else {
                // Fallback for touch devices (no Lenis instance)
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
        };

        resetScroll();
        const frameId = requestAnimationFrame(resetScroll);

        return () => cancelAnimationFrame(frameId);
    }, [pathname]);

    return <>{children}</>;
}
