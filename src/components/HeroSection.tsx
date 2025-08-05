import { DomainForm } from "./DomainForm";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Hero heading */}
        <div className="space-y-6">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-glow">
              .nad
            </h1>
            <div className="absolute inset-0 bg-gradient-primary bg-clip-text text-transparent blur-lg opacity-30 text-6xl md:text-8xl font-bold">
              .nad
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Claim your unique domain on the future of the web. 
            <span className="text-primary font-semibold"> Secure, decentralized, yours.</span>
          </p>
        </div>

        {/* Domain submission form */}
        <div className="relative">
          <DomainForm />
          
          {/* Decorative elements around form */}
          <div className="absolute -top-10 -left-10 w-20 h-20 border border-primary/20 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-accent/10 rotate-45 animate-float"></div>
        </div>

            
      </div>
    </section>
  );
}; 