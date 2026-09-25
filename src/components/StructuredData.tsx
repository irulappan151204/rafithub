import { socialLinks, businessInfo } from "@/data/contact";

export default function StructuredData() {
    // Use "ExerciseGym" — the correct Schema.org LocalBusiness subtype.
    // "Gym" is NOT a valid Schema.org @type and is ignored by Google's
    // structured data validator; "ExerciseGym" enables rich results.
    const schema = {
        "@context": "https://schema.org",
        "@type": "ExerciseGym",
        name: businessInfo.name,
        image: `${businessInfo.url}/og-image.jpg`,
        "@id": businessInfo.url,
        url: businessInfo.url,
        telephone: businessInfo.telephone,
        email: "rafithubmdu@gmail.com",
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
