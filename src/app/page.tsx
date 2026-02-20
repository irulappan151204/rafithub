import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Services from "@/components/Services";
import MembershipPlans from "@/components/MembershipPlans";
import TrainerCards from "@/components/TrainerCards";
import Testimonials from "@/components/Testimonials";
import GalleryPreview from "@/components/GalleryPreview";
import CTASection from "@/components/CTASection";

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
