import { GeometricBackground } from "@/components/GeometricBackground";
import { HeroSection } from "@/components/HeroSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GeometricBackground />
      <HeroSection />
    </div>
  );
};

export default Index;
