import { useState } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { ChefDiscovery } from "@/components/ui/chef-discovery";

const Index = () => {
  const [showDiscovery, setShowDiscovery] = useState(false);

  if (showDiscovery) {
    return <ChefDiscovery />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Quick Access Section */}
      <div className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Como funciona?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Escolha seu Chef</h3>
              <p className="text-muted-foreground">
                Navegue pelos perfis dos chefs e escolha o que mais combina com você
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Agende o Serviço</h3>
              <p className="text-muted-foreground">
                Defina data, horário e detalhes do seu evento gastronômico
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Desfrute da Experiência</h3>
              <p className="text-muted-foreground">
                Relaxe enquanto seu chef prepara uma experiência única
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowDiscovery(true)}
            className="mt-12 bg-gradient-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-accent transition-all duration-300"
          >
            Começar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
