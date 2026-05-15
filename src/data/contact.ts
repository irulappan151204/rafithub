// Centralized contact & social data for Rafithub
// Used in Footer, Contact page, and StructuredData

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
    mapUrl: "https://maps.google.com/?q=Rafithub+Madurai+Kochadai",
    hours: {
        weekday: "Mon-Sat: 5AM-10PM",
        weekend: "Sun: 6AM-2PM",
        display: "Mon-Sat: 5AM-10PM, Sun: 6AM-2PM",
    },
} as const;

export const businessInfo = {
    name: "Rafithub",
    url: "https://rafithub.com",
    telephone: contactInfo.phone,
    streetAddress: "1st Floor, 3/5B ABHI Complex, QMIS, Kochadai",
    addressLocality: "Madurai",
    postalCode: "625019",
    addressCountry: "IN",
    latitude: 9.9252,
    longitude: 78.0838,
    priceRange: "$$",
} as const;
