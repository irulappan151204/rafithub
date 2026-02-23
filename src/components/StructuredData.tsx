export default function StructuredData() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Gym",
        name: "Rafithub",
        image: "https://rafithub.com/og-image.jpg",
        "@id": "https://rafithub.com",
        url: "https://rafithub.com",
        telephone: "+917603903131",
        address: {
            "@type": "PostalAddress",
            streetAddress: "1st Floor, 3/5B ABHI Complex, QMIS, Kochadai",
            addressLocality: "Madurai",
            postalCode: "625019",
            addressCountry: "IN",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 9.9252,
            longitude: 78.0838,
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
        sameAs: [
            "https://www.instagram.com/rafithub_madurai?igsh=MTluM2VoZWdzeGZ5aQ==",
            "https://www.facebook.com/rafithubmdu",
            "https://x.com/rafithubmdu?t=aVFRyrI4pHJ626V6yzkdBQ&s=09"
        ],
        priceRange: "$$",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
