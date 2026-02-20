"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FadeUp, SlideLeft, SlideRight } from "@/components/ScrollAnimations";
import {
    HiMail,
    HiPhone,
    HiLocationMarker,
    HiClock,
    HiPaperAirplane,
} from "react-icons/hi";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaWhatsapp,
} from "react-icons/fa";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    company: z.string().optional(), // Honeypot field
});

type ContactFormData = z.infer<typeof contactSchema>;

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
    { Icon: FaFacebookF, href: "#", label: "Facebook", color: "#1877F2" },
    { Icon: FaInstagram, href: "#", label: "Instagram", color: "#E4405F" },
    { Icon: FaTwitter, href: "#", label: "Twitter", color: "#1DA1F2" },
    { Icon: FaYoutube, href: "#", label: "YouTube", color: "#FF0000" },
    { Icon: FaWhatsapp, href: "https://wa.me/917603903131", label: "WhatsApp", color: "#25D366" },
];

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        // Honeypot check
        if (data.company) {
            // Silently fail for bots
            setSubmitStatus("success");
            reset();
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message');
            }

            setSubmitStatus("success");
            reset();
        } catch (error) {
            console.error("Submission error:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] pt-24 text-[var(--foreground)] transition-colors duration-300">
            {/* Hero */}
            <section className="py-16 px-4 md:px-8 text-center">
                <FadeUp>
                    <span className="text-[var(--primary)] font-medium uppercase tracking-wider text-sm">
                        Get In Touch
                    </span>
                    <h1 className="heading-lg mt-4 text-[var(--foreground)]">
                        Contact <span className="text-gradient-gold">Us</span>
                    </h1>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mt-4">
                        Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                    </p>
                </FadeUp>
            </section>

            {/* Main Content */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <SlideRight>
                        <div className="card-glass p-8 bg-[var(--card)]/80">
                            <h2 className="heading-sm mb-6 text-[var(--foreground)]">Send Us a Message</h2>

                            {submitStatus === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-[var(--primary)]/20 border border-[var(--primary)]/50 rounded-lg text-[var(--primary)]"
                                >
                                    Thank you! Your message has been sent successfully.
                                </motion.div>
                            )}

                            {submitStatus === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-[var(--destructive)]"
                                >
                                    Something went wrong. Please try again later.
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm text-[var(--muted-foreground)] mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        {...register("name")}
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        className={`w-full px-4 py-3 bg-[var(--input)] border rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors ${errors.name ? "border-red-500" : "border-[var(--border)]"}`}
                                    />
                                    {errors.name && (
                                        <p className="text-[var(--destructive)] text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm text-[var(--muted-foreground)] mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        id="email"
                                        placeholder="john@example.com"
                                        className={`w-full px-4 py-3 bg-[var(--input)] border rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors ${errors.email ? "border-red-500" : "border-[var(--border)]"}`}
                                    />
                                    {errors.email && (
                                        <p className="text-[var(--destructive)] text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm text-[var(--muted-foreground)] mb-2">
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        {...register("phone")}
                                        type="tel"
                                        id="phone"
                                        placeholder="+91 76039 03131"
                                        className="w-full px-4 py-3 bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm text-[var(--muted-foreground)] mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        {...register("subject")}
                                        id="subject"
                                        className={`w-full px-4 py-3 bg-[var(--input)] border rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors ${errors.subject ? "border-red-500" : "border-[var(--border)]"}`}
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="Membership Inquiry">Membership Inquiry</option>
                                        <option value="Personal Training">Personal Training</option>
                                        <option value="Class Schedule">Class Schedule</option>
                                        <option value="Facility Tour">Facility Tour</option>
                                        <option value="General Question">General Question</option>
                                        <option value="Feedback">Feedback</option>
                                    </select>
                                    {errors.subject && (
                                        <p className="text-[var(--destructive)] text-sm mt-1">{errors.subject.message}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm text-[var(--muted-foreground)] mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        {...register("message")}
                                        id="message"
                                        rows={5}
                                        placeholder="How can we help you?"
                                        className={`w-full px-4 py-3 bg-[var(--input)] border rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors resize-none ${errors.message ? "border-red-500" : "border-[var(--border)]"}`}
                                    />
                                    {errors.message && (
                                        <p className="text-[var(--destructive)] text-sm mt-1">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* Honeypot Field */}
                                <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("company")} />

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <HiPaperAirplane className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </SlideRight>

                    {/* Contact Info & Map */}
                    <SlideLeft>
                        <div className="space-y-8">
                            {/* Contact Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {contactInfo.map((info) => (
                                    <motion.div
                                        key={info.label}
                                        whileHover={{ y: -5 }}
                                        className="card-glass p-6 bg-[var(--card)]/80"
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

                            {/* Social Links */}
                            <div className="card-glass p-6 bg-[var(--card)]/80">
                                <h4 className="text-[var(--foreground)] font-medium mb-4">Follow Us</h4>
                                <div className="flex gap-4 min-h-[50px] flex-wrap">
                                    {socialLinks.map(({ Icon, href, label, color }) => (
                                        <motion.a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={label}
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-12 h-12 bg-[var(--muted)] border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--muted-foreground)] transition-all duration-300"
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
                                            <Icon className="w-5 h-5" />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Map */}
                            <div className="card-glass overflow-hidden rounded-2xl h-[300px] bg-[var(--card)]/80">
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

                            {/* WhatsApp CTA */}
                            <motion.a
                                href="https://wa.me/917603903131"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="block w-full p-6 bg-[#25D366] rounded-2xl text-center text-white font-bold text-lg hover:bg-[#20BD5C] transition-colors shadow-lg"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <FaWhatsapp className="w-6 h-6" />
                                    Chat With Us on WhatsApp
                                </div>
                            </motion.a>
                        </div>
                    </SlideLeft>
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
                            <div className="card-glass p-6 bg-[var(--card)]/80">
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
