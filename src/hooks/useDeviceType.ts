"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect device type based on viewport width.
 * SSR-safe: defaults to desktop (isMobile = false) during server render.
 * Debounces resize listener to prevent excessive re-renders.
 * Cleans up resize listener on unmount to prevent memory leaks.
 */
export function useDeviceType() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const checkDevice = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
            }, 150);
        };

        // Initial check (no debounce)
        setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

        window.addEventListener("resize", checkDevice);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", checkDevice);
        };
    }, []);

    return { isMobile };
}
