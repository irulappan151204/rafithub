// Centralized contact & social data for Rafithub
// Used in Footer, Contact page, and StructuredData

import { getSiteUrl } from "@/lib/format";

export const socialLinks = [
  {
    platform: "facebook",
    href: "https://www.facebook.com/rafithubmdu",
    label: "Facebook",
    color: "#1877F2",
  },
  {
    platform: "instagram",
    href: "https://www.instagram.com/rafithub_madurai?igsh=MTluM2VoZWdzeGZ5aQ==",
    label: "Instagram",
    color: "#E4405F",
  },
  {
    platform: "twitter",
    href: "https://x.com/rafithubmdu?t=aVFRyrI4pHJ626V6yzkdBQ&s=09",
    label: "X (Twitter)",
    color: "#000000",
  },
  {
    platform: "whatsapp",
    href: "https://wa.me/917603903131",
    label: "WhatsApp",
    color: "#25D366",
  },
] as const;

export const contactInfo = {
  phone: "+917603903131",
  phoneDisplay: "+91 76039 03131",
  email: "rafithubmdu@gmail.com",
  whatsapp: "https://wa.me/917603903131",
  address: "1st Floor, 3/5B ABHI Complex, QMIS, Kochadai, Madurai – 625019",
  landmark: "(Next to QMIS School)",
  mapUrl: "https://maps.google.com/?q=Rafithub+Madurai+Kochadai",
  trialDays: 7,
  hours: {
    weekday: "Mon-Sat: 5AM-10PM",
    weekdayLong: "05:00 AM – 10:00 PM",
    weekend: "Sun: 6AM-2PM",
    weekendLong: "06:00 AM – 02:00 PM",
    display: "Mon-Sat: 5AM-10PM, Sun: 6AM-2PM",
  },
} as const;

export const businessInfo = {
  name: "Rafithub",
  get url() {
    return getSiteUrl();
  },
  telephone: contactInfo.phone,
  email: contactInfo.email,
  streetAddress: "1st Floor, 3/5B ABHI Complex, QMIS, Kochadai",
  addressLocality: "Madurai",
  postalCode: "625019",
  addressCountry: "IN",
  latitude: 9.9252,
  longitude: 78.0838,
  priceRange: "₹₹",
} as const;
