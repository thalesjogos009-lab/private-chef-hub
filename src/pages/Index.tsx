import { useState } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { ChefDiscovery } from "@/components/ui/chef-discovery";
import { ChefDetails } from "@/components/ui/chef-details";
import { BookingFlow } from "@/components/ui/booking-flow";
import { AuthFlow } from "@/components/ui/auth-flow";
import { SplashScreen } from "@/components/ui/splash-screen";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";

type AppState = 
  | 'splash'
  | 'hero' 
  | 'discovery' 
  | 'chef-details' 
  | 'booking' 
  | 'auth'
  | 'booking-success';

type AuthMode = 'login' | 'signup' | 'chef-signup';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [selectedChefId, setSelectedChefId] = useState<string>('');
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleSplashComplete = () => {
    setAppState('hero');
  };

  const handleStartDiscovery = () => {
    setAppState('discovery');
  };

  const handleChefSelect = (chefId: string) => {
    setSelectedChefId(chefId);
    setAppState('chef-details');
  };

  const handleBookingStart = () => {
    setAppState('booking');
  };

  const handleBookingComplete = () => {
    setAppState('booking-success');
  };

  const handleAuthStart = (mode: AuthMode) => {
    setAuthMode(mode);
    setAppState('auth');
  };

  const handleAuthSuccess = () => {
    setAppState('discovery');
  };

  const handleBackToHero = () => {
    setAppState('hero');
  };

  const handleBackToDiscovery = () => {
    setAppState('discovery');
  };

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'auth') {
    return (
      <AuthFlow
        mode={authMode}
        onBack={handleBackToHero}
        onSuccess={handleAuthSuccess}
        onModeChange={setAuthMode}
      />
    );
  }

  if (appState === 'chef-details') {
    return (
      <ChefDetails
        chefId={selectedChefId}
        onBack={handleBackToDiscovery}
        onBooking={handleBookingStart}
      />
    );
  }

  if (appState === 'booking') {
    return (
      <BookingFlow
        chefId={selectedChefId}
        onBack={() => setAppState('chef-details')}
        onComplete={handleBookingComplete}
      />
    );
  }

  if (appState === 'booking-success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Solicitação Enviada!
          </h1>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Sua solicitação foi enviada com sucesso. O chef entrará em contato em breve para confirmar os detalhes do seu evento gastronômico.
          </p>

          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-primary"
              onClick={handleBackToDiscovery}
            >
              Descobrir Mais Chefs
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleBackToHero}
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'discovery') {
    return <ChefDiscovery onChefSelect={handleChefSelect} />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection 
        onFindChef={handleStartDiscovery}
        onBecomeChef={() => handleAuthStart('chef-signup')}
        onLogin={() => handleAuthStart('login')}
      />
      
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
            onClick={handleStartDiscovery}
            className="mt-12 bg-gradient-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-accent transition-all duration-300"
          >
            Começar Agora
          </button>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="text-xl text-foreground mb-4 italic">
              "Uma experiência gastronômica incrível! O Chef Marco superou todas as nossas expectativas. Recomendo demais!"
            </blockquote>
            <cite className="text-muted-foreground">
              — Ana Carolina, São Paulo
            </cite>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
