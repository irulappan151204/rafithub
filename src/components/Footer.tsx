"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker, HiClock } from "react-icons/hi";
import { useTheme } from "./ThemeProvider";
import { contactInfo as fallbackContact, socialLinks as fallbackSocials } from "@/data/contact";

const footerLinks = {
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Classes", href: "/classes" },
    { name: "Trainers", href: "/trainers" },
    { name: "Services", href: "/services" },
  ],
  support: [
    { name: "FAQs", href: "/contact#faq" },
    { name: "Membership", href: "/membership" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Admin Login", href: "/admin" },
  ],
};

const iconMap = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
} as const;

export interface FooterSettingsProp {
  gymName?: string;
  description?: string;
  address?: string;
  landmark?: string | null;
  phone?: string;
  phoneDisplay?: string;
  email?: string;
  whatsappUrl?: string;
  workingHours?: Array<{ days: string; hours: string }>;
  socialLinks?: Array<{ platform: string; href: string; label: string }>;
}

export default function Footer({ settings }: { settings?: FooterSettingsProp }) {
  const { theme } = useTheme();
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const gymName = settings?.gymName ?? "Rafithub";
  const address = settings?.address ?? fallbackContact.address;
  const landmark = settings?.landmark ?? fallbackContact.landmark;
  const phone = settings?.phone ?? fallbackContact.phone;
  const phoneDisplay = settings?.phoneDisplay ?? fallbackContact.phoneDisplay;
  const email = settings?.email ?? fallbackContact.email;
  const whatsappUrl = settings?.whatsappUrl ?? fallbackContact.whatsapp;
  const workingHours =
    settings?.workingHours && settings.workingHours.length > 0
      ? settings.workingHours
      : [
          { days: "Monday – Saturday", hours: fallbackContact.hours.weekdayLong },
          { days: "Sunday", hours: fallbackContact.hours.weekendLong },
        ];
  const rawSocials =
    settings?.socialLinks && settings.socialLinks.length > 0
      ? settings.socialLinks
      : [...fallbackSocials];

  const socialItems = rawSocials.flatMap((s) => {
    if (!(s.platform in iconMap)) return [];
    return [
      {
        Icon: iconMap[s.platform as keyof typeof iconMap],
        href: s.href,
        label: s.label,
      },
    ];
  });

  return (
    <footer className="relative z-10 bg-[var(--card)] border-t border-[var(--border)] text-[var(--foreground)] transition-colors duration-300 pb-16 lg:pb-0">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1 footer-col">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-2">
                <Image
                  src={
                    theme === "dark"
                      ? "/assets/logo/logo_white.png"
                      : "/assets/logo/logo_black.png"
                  }
                  alt={`${gymName} Logo`}
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
              Transform your body and mind at {gymName}. Where champions are made and limits are
              shattered. Join us on your fitness journey.
            </p>

            <div className="flex gap-3">
              {socialItems.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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

          <div className="footer-col">
            <h4 className="font-bold text-lg mb-6 text-[var(--foreground)]">Contact Us</h4>
            <div className="space-y-4 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-start gap-3">
                <HiLocationMarker className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                <span>
                  {address}
                  {landmark && (
                    <>
                      <br />
                      {landmark}
                    </>
                  )}
                </span>
              </div>
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors"
              >
                <HiPhone className="w-5 h-5 text-[var(--primary)]" />
                <span>{phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors"
              >
                <HiMail className="w-5 h-5 text-[var(--primary)]" />
                <span>{email}</span>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="font-bold text-lg mb-6 text-[var(--foreground)]">Working Hours</h4>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
              {workingHours.map((slot) => (
                <li key={slot.days} className="flex items-start gap-3">
                  <HiClock className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-[var(--foreground)]">{slot.days}</span>
                    <span>{slot.hours}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="font-bold text-lg mb-6 text-[var(--foreground)]">Quick Links</h4>
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

      <div className="border-t border-[var(--border)] bg-[var(--background)]">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--muted-foreground)] text-sm text-center md:text-left">
            © {new Date().getFullYear()} {gymName}. All rights reserved.
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

      {/* Floating WhatsApp Button — positioned cleanly above mobile sticky bar */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 w-12 h-12 lg:w-14 lg:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl z-40 transition-shadow"
      >
        <FaWhatsapp className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
      </motion.a>
    </footer>
  );
}
