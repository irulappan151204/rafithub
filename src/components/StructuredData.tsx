import { socialLinks, businessInfo } from "@/data/contact";

export default function StructuredData() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Gym",
        name: businessInfo.name,
        image: `${businessInfo.url}/og-image.jpg`,
        "@id": businessInfo.url,
        url: businessInfo.url,
        telephone: businessInfo.telephone,
        address: {
            "@type": "PostalAddress",
            streetAddress: businessInfo.streetAddress,
            addressLocality: businessInfo.addressLocality,
            postalCode: businessInfo.postalCode,
            addressCountry: businessInfo.addressCountry,
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: businessInfo.latitude,
            longitude: businessInfo.longitude,
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "05:00",
                closes: "22:00",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Sunday",
                opens: "06:00",
                closes: "14:00",
            },
        ],
        sameAs: socialLinks
            .filter((s) => s.platform !== "whatsapp")
            .map((s) => s.href),
        priceRange: businessInfo.priceRange,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

