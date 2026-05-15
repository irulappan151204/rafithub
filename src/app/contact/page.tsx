"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/ScrollAnimations";
import PageHero from "@/components/PageHero";
import {
    HiMail,
    HiPhone,
    HiLocationMarker,
    HiClock,
} from "react-icons/hi";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaWhatsapp,
} from "react-icons/fa";

const contactInfo = [
    {
        icon: HiPhone,
        label: "Phone",
        value: "+91 76039 03131",
        href: "tel:+917603903131",
    },
    {
        icon: HiMail,
        label: "Email",
        value: "rafithubmdu@gmail.com",
        href: "mailto:rafithubmdu@gmail.com",
    },
    {
        icon: HiLocationMarker,
        label: "Address",
        value: "1st Floor, 3/5B ABHI Complex, QMIS, Kochadai, Madurai – 625019",
        href: "https://maps.google.com/?q=Rafithub+Madurai+Kochadai",
    },
    {
        icon: HiClock,
        label: "Hours",
        value: "Mon-Sat: 5AM-10PM, Sun: 6AM-2PM",
        href: null,
    },
];

const socialLinks = [
    { Icon: FaFacebookF, href: "https://www.facebook.com/rafithubmdu", label: "Facebook", color: "#1877F2" },
    { Icon: FaInstagram, href: "https://www.instagram.com/rafithub_madurai?igsh=MTluM2VoZWdzeGZ5aQ==", label: "Instagram", color: "#E4405F" },
    { Icon: FaTwitter, href: "https://x.com/rafithubmdu?t=aVFRyrI4pHJ626V6yzkdBQ&s=09", label: "X (Twitter)", color: "#000000" },
    { Icon: FaWhatsapp, href: "https://wa.me/917603903131", label: "WhatsApp", color: "#25D366" },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
            <PageHero
                eyebrow="Get In Touch"
                title={<>Contact <span className="text-gradient-gold">Us</span></>}
                description="We'd love to hear from you. Reach out through any of our channels below."
                imageSrc="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80"
                stats={[
                    { value: "5AM", label: "Open" },
                    { value: "10PM", label: "Close" },
                    { value: "Kochadai", label: "Madurai" },
                    { value: "WA", label: "Fast Chat" },
                ]}
            />

            {/* Main Content */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <div className="max-w-4xl mx-auto">
                    {/* Contact Info & Map */}
                    <FadeUp>
                        <div className="space-y-8">
                            {/* Contact Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {contactInfo.map((info) => (
                                    <motion.div
                                        key={info.label}
                                        whileHover={{ y: -5 }}
                                        className="card-glass p-8 bg-[var(--card)]/80"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <info.icon className="w-6 h-6 text-[var(--primary)]" />
                                            </div>
                                            <div>
                                                <h4 className="text-[var(--foreground)] font-medium mb-1">{info.label}</h4>
                                                {info.href ? (
                                                    <a
                                                        href={info.href}
                                                        className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors text-sm break-words"
                                                    >
                                                        {info.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-[var(--muted-foreground)] text-sm">{info.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Social Links */}
                                <div className="card-glass p-8 bg-[var(--card)]/80">
                                    <h4 className="text-[var(--foreground)] font-medium mb-6 text-center">Follow Us</h4>
                                    <div className="flex gap-6 min-h-[50px] flex-wrap justify-center">
                                        {socialLinks.map(({ Icon, href, label, color }) => (
                                            <motion.a
                                                key={label}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={label}
                                                whileHover={{ scale: 1.1, y: -3 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-14 h-14 bg-[var(--muted)] border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--muted-foreground)] transition-all duration-300 shadow-sm"
                                                style={{
                                                    ["--hover-color" as string]: color,
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = color;
                                                    e.currentTarget.style.borderColor = color;
                                                    e.currentTarget.style.color = '#ffffff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = '';
                                                    e.currentTarget.style.borderColor = '';
                                                    e.currentTarget.style.color = '';
                                                }}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* WhatsApp CTA */}
                                <div className="flex items-center">
                                    <motion.a
                                        href="https://wa.me/917603903131"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full p-8 bg-[#25D366] rounded-3xl text-center text-white font-bold text-xl hover:bg-[#20BD5C] transition-colors shadow-lg flex items-center justify-center gap-4 h-full"
                                    >
                                        <FaWhatsapp className="w-8 h-8" />
                                        Chat on WhatsApp
                                    </motion.a>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="card-glass overflow-hidden rounded-3xl h-[400px] bg-[var(--card)]/80 shadow-md">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15721.492572579737!2d78.0838!3d9.9252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c58e5a00d7d3%3A0x6b6a032870191823!2sKochadai%2C%20Madurai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1703000000000!5m2!1sen!2sin"
                                    title="Rafithub gym location on Google Maps"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="container-custom px-4 md:px-8 pb-20">
                <FadeUp className="text-center mb-12">
                    <h2 className="heading-md text-[var(--foreground)]">
                        Frequently Asked <span className="text-[var(--primary)]">Questions</span>
                    </h2>
                </FadeUp>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {[
                        {
                            q: "What are your operating hours?",
                            a: "We are open Mon-Sat 5AM-10PM and Sunday 6AM-2PM.",
                        },
                        {
                            q: "Do you offer free trials?",
                            a: "Yes! We offer a complimentary 3-day trial for all first-time visitors.",
                        },
                        {
                            q: "Is parking available?",
                            a: "Yes, we have free parking space for our members.",
                        },
                        {
                            q: "Do you provide personal training?",
                            a: "Absolutely! We have certified trainers available for personalized coaching.",
                        },
                    ].map((faq, index) => (
                        <FadeUp key={index} delay={index * 0.1}>
                            <div className="card-glass p-6 bg-[var(--card)]/80 h-full">
                                <h4 className="text-[var(--foreground)] font-medium mb-2">{faq.q}</h4>
                                <p className="text-[var(--muted-foreground)] text-sm">{faq.a}</p>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </section>
        </div>
    );
}
