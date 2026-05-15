import type { Metadata } from "next";
import { Outfit, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import StructuredData from "@/components/StructuredData";
import ErrorBoundary from "@/components/ErrorBoundary";
import AmbientScene from "@/components/AmbientScene";
import PageTransition from "@/components/PageTransition";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rafithub.com"),
  title: {
    default: "Rafithub | Premium Fitness & Personal Training",
    template: "%s | Rafithub",
  },
  description:
    "Rafithub is a premium fitness center in Madurai offering expert personal training, group fitness programs, strength training, crossfit, and transformation-focused workouts. Join our elite gym to transform your body and mind with certified trainers.",
  keywords: [
    "gym in madurai",
    "fitness center madurai",
    "personal training",
    "rafithub gym",
    "best gym near me",
    "strength training",
    "crossfit madurai",
    "weight loss program",
    "bodybuilding madurai",
    "functional training",
    "fitness classes madurai",
    "cardio workout madurai",
    "muscle building",
    "health club madurai",
    "kochadai gym",
    "premium gym madurai",
    "gym with certified trainers",
    "weight gain program",
    "fitness coaching",
  ],
  authors: [{ name: "Rafithub" }],
  openGraph: {
    title: "Rafithub | Premium Fitness & Personal Training",
    description:
      "Train smarter. Transform faster. Join Rafithub – Madurai’s premium fitness experience.",
    url: "https://rafithub.com",
    siteName: "Rafithub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rafithub Gym Madurai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafithub | Premium Fitness Experience",
    description:
      "Train smarter. Transform faster. Join Rafithub – Madurai’s premium fitness experience.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${bebas.variable}`} suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors duration-300">
        <StructuredData />
        <ThemeProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <AmbientScene />
            <SmoothScroll>
              <Navbar />
              <main className="relative z-10">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </SmoothScroll>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
