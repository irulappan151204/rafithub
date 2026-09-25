"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaWhatsapp,
} from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker, HiClock } from "react-icons/hi";
import { useTheme } from "./ThemeProvider";

const footerLinks = {
    quickLinks: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Classes", href: "/classes" },
        { name: "Trainers", href: "/trainers" },
    ],
    services: [
        { name: "Strength Training", href: "/services#strength" },
        { name: "CrossFit", href: "/services#crossfit" },
        { name: "Personal Training", href: "/services#personal" },
        { name: "Nutrition", href: "/services#nutrition" },
    ],
    support: [
        { name: "FAQs", href: "/contact#faq" },
        { name: "Membership", href: "/membership" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact", href: "/contact" },
    ],
};

const socialLinks = [
    { Icon: FaFacebookF, href: "https://www.facebook.com/rafithubmdu", label: "Facebook" },
    { Icon: FaInstagram, href: "https://www.instagram.com/rafithub_madurai?igsh=MTluM2VoZWdzeGZ5aQ==", label: "Instagram" },
    { Icon: FaTwitter, href: "https://x.com/rafithubmdu?t=aVFRyrI4pHJ626V6yzkdBQ&s=09", label: "X (Twitter)" },
];

export default function Footer() {
    const { theme } = useTheme();

    return (
        <footer className="relative z-10 bg-[var(--card)] border-t border-[var(--border)] text-[var(--foreground)] transition-colors duration-300">
            {/* Main Footer */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1 footer-col">
                        <Link href="/" className="inline-block mb-6">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={theme === "dark" ? "/assets/logo/logo_white.png" : "/assets/logo/logo_black.png"}
                                    alt="Rafithub Logo"
                                    width={160}
                                    height={40}
                                    className="h-10 w-auto object-contain"
                                />
                                <span className="font-display text-2xl tracking-wide text-[var(--foreground)] hidden sm:block">
                                    RAFI<span className="text-[var(--primary)]">THUB</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-[var(--muted-foreground)] mb-6 text-sm leading-relaxed">
                            Transform your body and mind at Rafithub. Where champions are made
                            and limits are shattered. Join us on your fitness journey.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map(({ Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-9 h-9 border border-[var(--border)] bg-[var(--background)] rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300 shadow-sm"
                                >
                                    <Icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-col">
                        <h4 className="font-bold text-lg mb-6 text-[var(--foreground)]">
                            Contact Us
                        </h4>
                        <div className="space-y-4 text-sm text-[var(--muted-foreground)]">
                            <div className="flex items-start gap-3">
                                <HiLocationMarker className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                                <span>
                                    1st Floor, 3/5B ABHI Complex,<br />
                                    QMIS, Kochadai,<br />
                                    Madurai – 625019<br />
                                    (Next to QMIS School)
                                </span>
                            </div>
                            <a
                                href="tel:+917603903131"
                                className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors"
                            >
                                <HiPhone className="w-5 h-5 text-[var(--primary)]" />
                                <span>+91 76039 03131</span>
                            </a>
                            <a
                                href="mailto:rafithubmdu@gmail.com"
                                className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors"
                            >
                                <HiMail className="w-5 h-5 text-[var(--primary)]" />
                                <span>rafithubmdu@gmail.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div className="footer-col">
                        <h4 className="font-bold text-lg mb-6 text-[var(--foreground)]">
                            Working Hours
                        </h4>
                        <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
                            <li className="flex items-start gap-3">
                                <HiClock className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium text-[var(--foreground)]">Monday – Saturday</span>
                                    <span>05:00 AM – 10:00 PM</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <HiClock className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium text-[var(--foreground)]">Sunday</span>
                                    <span>06:00 AM – 02:00 PM</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Quick & Services Links (Combined for compact layout) */}
                    <div className="footer-col">
                        <h4 className="font-bold text-lg mb-6 text-[var(--foreground)]">
                            Quick Links
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {footerLinks.quickLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] text-sm transition-colors duration-300 flex items-center gap-2 group reveal-underline"
                                >
                                    <span className="w-0 h-0.5 bg-[var(--primary)] group-hover:w-2 transition-all duration-300" />
                                    {link.name}
                                </Link>
                            ))}
                            {footerLinks.support.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] text-sm transition-colors duration-300 flex items-center gap-2 group reveal-underline"
                                >
                                    <span className="w-0 h-0.5 bg-[var(--primary)] group-hover:w-2 transition-all duration-300" />
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--border)] bg-[var(--background)]">
                <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[var(--muted-foreground)] text-sm text-center md:text-left">
                        © {new Date().getFullYear()} Rafithub. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link
                            href="/privacy"
                            className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <motion.a
                href="https://wa.me/917603903131"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl z-40 transition-shadow"
            >
                <FaWhatsapp className="w-7 h-7 text-white" />
            </motion.a>
        </footer>
    );
}
