"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/ScrollAnimations";
import PageHero from "@/components/PageHero";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
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

const socialIconMap = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  whatsapp: FaWhatsapp,
} as const;

interface ContactClientProps {
  settings: {
    phone: string;
    phoneDisplay: string;
    email: string;
    address: string;
    mapUrl: string;
    mapEmbedUrl: string;
    whatsappUrl: string;
    trialDays: number;
    workingHours: Array<{ days: string; hours: string }>;
    socialLinks: Array<{ platform: string; href: string; label: string; color?: string }>;
  };
  faqs: Array<{ id: string; question: string; answer: string }>;
}

export default function ContactClient({ settings, faqs }: ContactClientProps) {
  const hoursSummary =
    settings.workingHours.map((w) => `${w.days}: ${w.hours}`).join(", ") ||
    "Mon-Sat: 5AM-10PM, Sun: 6AM-2PM";

  const contactCards = [
    {
      icon: HiPhone,
      label: "Phone",
      value: settings.phoneDisplay,
      href: `tel:${settings.phone}`,
    },
    {
      icon: HiMail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: HiLocationMarker,
      label: "Address",
      value: settings.address,
      href: settings.mapUrl,
    },
    {
      icon: HiClock,
      label: "Hours",
      value: hoursSummary,
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <PageHero
        eyebrow="Get In Touch"
        title={
          <>
            Contact <span className="text-gradient-gold">Us</span>
          </>
        }
        description="We'd love to hear from you. Book your free trial or reach out through any of our channels below."
        imageSrc="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80"
        stats={[
          { value: "5AM", label: "Open" },
          { value: "10PM", label: "Close" },
          { value: "Kochadai", label: "Madurai" },
          { value: `${settings.trialDays}-Day`, label: "Trial" },
        ]}
      />

      {/* Enquiry Form + Contact Info */}
      <section className="container-custom px-4 md:px-8 pb-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <FadeUp>
            <LeadCaptureForm
              source="contact"
              title={`Book Your ${settings.trialDays}-Day Free Trial or Ask a Question`}
              submitLabel="Send enquiry"
            />
          </FadeUp>

          <FadeUp>
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactCards.map((info) => (
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
                <div className="card-glass p-8 bg-[var(--card)]/80">
                  <h4 className="text-[var(--foreground)] font-medium mb-6 text-center">
                    Follow Us
                  </h4>
                  <div className="flex gap-6 min-h-[50px] flex-wrap justify-center">
                    {settings.socialLinks.map((link) => {
                      const Icon =
                        socialIconMap[link.platform as keyof typeof socialIconMap] ?? FaWhatsapp;
                      return (
                        <motion.a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.label}
                          whileHover={{ scale: 1.1, y: -3 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-14 h-14 bg-[var(--muted)] border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300 shadow-sm"
                        >
                          <Icon className="w-6 h-6" />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center">
                  <motion.a
                    href={settings.whatsappUrl}
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

              <div className="card-glass overflow-hidden rounded-3xl h-[400px] bg-[var(--card)]/80 shadow-md">
                <iframe
                  src={settings.mapEmbedUrl}
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
      {faqs.length > 0 && (
        <section id="faq" className="container-custom px-4 md:px-8 pb-20">
          <FadeUp className="text-center mb-12">
            <h2 className="heading-md text-[var(--foreground)]">
              Frequently Asked <span className="text-[var(--primary)]">Questions</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <FadeUp key={faq.id} delay={index * 0.06}>
                <div className="card-glass p-6 bg-[var(--card)]/80 h-full">
                  <h4 className="text-[var(--foreground)] font-medium mb-2">{faq.question}</h4>
                  <p className="text-[var(--muted-foreground)] text-sm">{faq.answer}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
