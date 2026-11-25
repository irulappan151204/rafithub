import { socialLinks as fallbackSocials, businessInfo } from "@/data/contact";

export interface StructuredDataProps {
  gymName?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: Array<{ platform: string; href: string }>;
}

export default function StructuredData({ data }: { data?: StructuredDataProps }) {
  const socials =
    data?.socialLinks && data.socialLinks.length > 0
      ? data.socialLinks
      : [...fallbackSocials];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: data?.gymName ?? businessInfo.name,
    image: `${businessInfo.url}/og-image.jpg`,
    "@id": businessInfo.url,
    url: businessInfo.url,
    telephone: data?.phone ?? businessInfo.telephone,
    email: data?.email ?? businessInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: data?.address ?? businessInfo.streetAddress,
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
    sameAs: socials.filter((s) => s.platform !== "whatsapp").map((s) => s.href),
    priceRange: businessInfo.priceRange,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
