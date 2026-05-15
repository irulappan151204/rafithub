"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { Magnetic } from "./PremiumMotion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Classes", href: "/classes" },
    { name: "Membership", href: "/membership" },
    { name: "Trainers", href: "/trainers" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme } = useTheme();
    const { scrollYProgress } = useScroll();
    const progressScale = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 26,
        mass: 0.6,
    });
    const useLightNavChrome = !isScrolled && (theme === "dark" || pathname === "/");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
                className={`fixed left-0 right-0 top-0 z-50 px-3 transition-all duration-300 ${isScrolled
                    ? "pt-3"
                    : "pt-4"
                    }`}
            >
                <nav
                    className={`container-custom flex items-center justify-between rounded-2xl border px-4 transition-all duration-300 md:px-5 ${isScrolled
                        ? "border-[var(--border)] bg-[var(--glass)] py-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
                        : useLightNavChrome
                            ? "border-white/10 bg-black/10 py-3 backdrop-blur-sm"
                            : "border-[var(--border)] bg-[var(--glass)] py-3 shadow-[0_18px_60px_rgba(16,22,19,0.12)] backdrop-blur-2xl"
                        }`}
                >
                    {/* Logo */}
                    <Link href="/" className="relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2"
                        >
                            <Image
                                src={useLightNavChrome ? "/assets/logo/logo_white.png" : "/assets/logo/logo_black.png"}
                                alt="Rafithub Logo"
                                width={160}
                                height={40}
                                className="h-10 w-auto object-contain"
                                priority
                            />
                            <span className={`font-display text-2xl tracking-wide hidden sm:block transition-colors duration-300 ${useLightNavChrome ? "text-white" : "text-[var(--foreground)]"}`}>
                                RAFI<span className="text-[var(--primary)]">THUB</span>
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl lg:flex">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="relative">
                                <motion.span
                                    whileHover={{ y: -2 }}
                                    className={`relative inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${pathname === link.href
                                        ? "text-[var(--primary)]"
                                        : useLightNavChrome
                                            ? "text-white/90 hover:text-white"
                                            : "text-[var(--foreground)]/80 hover:text-[var(--foreground)]"
                                        }`}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {pathname === link.href && (
                                        <motion.span
                                            layoutId="activeNav"
                                            className="absolute inset-0 rounded-full border border-[var(--primary)]/25 bg-[var(--primary)]/10 shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_22%,transparent)]"
                                            transition={{ type: "spring", stiffness: 330, damping: 28 }}
                                        />
                                    )}
                                </motion.span>
                            </Link>
                        ))}
                    </div>

                    {/* CTA & Theme Toggle */}
                    <div className="hidden lg:flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/membership">
                            <Magnetic>
                                <motion.button
                                    whileTap={{ scale: 0.96 }}
                                    className="btn-primary px-6 py-2.5 text-sm"
                                >
                                    Join Now
                                </motion.button>
                            </Magnetic>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-3">
                        <ThemeToggle />
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMobileMenuOpen}
                            className={`relative z-10 rounded-xl border border-white/10 bg-white/10 p-2 shadow-inner backdrop-blur-xl transition-colors duration-300 ${useLightNavChrome ? "text-white" : "text-[var(--foreground)]"}`}
                        >
                            {isMobileMenuOpen ? (
                                <HiX className="w-6 h-6" />
                            ) : (
                                <HiMenuAlt3 className="w-6 h-6" />
                            )}
                        </motion.button>
                    </div>
                </nav>
                <motion.div
                    className="mx-auto mt-2 h-px max-w-7xl origin-left rounded-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
                    style={{ scaleX: progressScale }}
                />
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute bottom-0 right-0 top-0 w-[min(88vw,24rem)] border-l border-[var(--border)] bg-[var(--glass)] shadow-2xl backdrop-blur-2xl"
                        >
                            <div className="flex h-full flex-col overflow-y-auto px-8 pt-28">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: 28, filter: "blur(8px)" }}
                                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                        transition={{ delay: index * 0.055, type: "spring", damping: 22 }}
                                    >
                                        <Link href={link.href}>
                                            <span
                                                className={`block rounded-xl border-b border-[var(--border)] px-4 py-4 text-lg font-semibold transition-colors duration-300 ${pathname === link.href
                                                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                                    : "text-[var(--foreground)]/70 hover:bg-white/5 hover:text-[var(--foreground)]"
                                                    }`}
                                            >
                                                {link.name}
                                            </span>
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 mb-8"
                                >
                                    <Link href="/membership">
                                        <button className="btn-primary w-full shadow-lg">Join Now</button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
