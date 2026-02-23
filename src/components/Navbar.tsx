"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";

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
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)] shadow-sm"
                    : "bg-transparent"
                    }`}
            >
                <nav className="container-custom flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2"
                        >
                            <Image
                                src="/assets/logo/logo_black.png"
                                alt="Rafithub Logo"
                                width={160}
                                height={40}
                                className="h-10 w-auto object-contain dark:hidden block"
                                priority
                            />
                            <Image
                                src="/assets/logo/logo_white.png"
                                alt="Rafithub Logo"
                                width={160}
                                height={40}
                                className="h-10 w-auto object-contain hidden dark:block"
                                priority
                            />
                            <span className="font-display text-2xl tracking-wide text-[var(--foreground)] hidden sm:block">
                                RAFI<span className="text-[var(--primary)]">THUB</span>
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href}>
                                <motion.span
                                    whileHover={{ y: -2 }}
                                    className={`relative font-medium transition-colors duration-300 ${pathname === link.href
                                        ? "text-[var(--primary)]"
                                        : "text-[var(--foreground)]/80 hover:text-[var(--foreground)]"
                                        }`}
                                >
                                    {link.name}
                                    {pathname === link.href && (
                                        <motion.span
                                            layoutId="activeNav"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--primary)]"
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
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary text-sm px-6 py-2.5"
                            >
                                Join Now
                            </motion.button>
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
                            className="relative z-10 p-2 text-[var(--foreground)]"
                        >
                            {isMobileMenuOpen ? (
                                <HiX className="w-6 h-6" />
                            ) : (
                                <HiMenuAlt3 className="w-6 h-6" />
                            )}
                        </motion.button>
                    </div>
                </nav>
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
                            className="absolute right-0 top-0 bottom-0 w-80 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl"
                        >
                            <div className="flex flex-col pt-24 px-8 h-full overflow-y-auto">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link href={link.href}>
                                            <span
                                                className={`block py-4 text-lg font-medium border-b border-[var(--border)] transition-colors duration-300 ${pathname === link.href
                                                    ? "text-[var(--primary)]"
                                                    : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
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
