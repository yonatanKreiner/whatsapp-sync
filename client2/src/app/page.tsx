import CallToAction from "@/components/home/CallToAction";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PricingPlans from "@/components/home/PricingPlans";
import Testimonials from "@/components/home/Testimonials";
import Layout from "@/components/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PricingPlans />
      <CallToAction />
    </Layout>
  );
}
