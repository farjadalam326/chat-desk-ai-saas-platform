import React from "react";
import Header from "../../components/Header/Header";
import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import PricingSection from "../../components/PricingSection/PricingSection";
import TestimonialSection from "../../components/TestimonialSection/TestimonialSection";
import CtaSection from "../../components/CtaSection/CtaSection";
import Footer from "../../components/Footer/Footer";
import { useTheme } from "../../context/ThemeContext";

export const LandingPage: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
