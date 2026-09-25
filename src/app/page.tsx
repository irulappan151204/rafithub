import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

// Below-fold sections lazy-loaded so the critical Hero + above-fold paint is
// not blocked by heavy animation setup (TiltCards, motion values) in these
// components. They load once the user scrolls toward them.
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const Services = dynamic(() => import("@/components/Services"));
const MembershipPlans = dynamic(() => import("@/components/MembershipPlans"));
const TrainerCards = dynamic(() => import("@/components/TrainerCards"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const GalleryPreview = dynamic(() => import("@/components/GalleryPreview"));
const CTASection = dynamic(() => import("@/components/CTASection"));

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Services />
      <MembershipPlans />
      <TrainerCards />
      <Testimonials />
      <GalleryPreview />
      <CTASection />
    </>
  );
}
