import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Services from "@/components/Services";
import MembershipPlans from "@/components/MembershipPlans";
import TrainerCards from "@/components/TrainerCards";

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
