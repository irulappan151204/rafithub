"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect device type based on viewport width.
 * SSR-safe: defaults to desktop (isMobile = false) during server render.
 * Cleans up resize listener on unmount to prevent memory leaks.
 */
export function useDeviceType() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };

        // Initial check
        checkDevice();

        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    return { isMobile };
}
