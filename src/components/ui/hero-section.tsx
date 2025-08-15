import { Button } from "@/components/ui/button";
import { ChefHat, Star, Users } from "lucide-react";

interface HeroSectionProps {
  onFindChef: () => void;
  onBecomeChef: () => void;
  onLogin: () => void;
}

export function HeroSection({ onFindChef, onBecomeChef, onLogin }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Chef em Casa
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
          Experiências gastronômicas premium na sua casa
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <div className="flex items-center gap-2 text-white/90">
            <Star className="w-5 h-5 fill-white/80" />
            <span>Chefs verificados</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Users className="w-5 h-5" />
            <span>Eventos personalizados</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <ChefHat className="w-5 h-5" />
            <span>Culinária premium</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-accent hover:bg-white/90 font-semibold px-8 py-3"
            onClick={onFindChef}
          >
            Encontrar Chef
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3"
            onClick={onBecomeChef}
          >
            Seja um Chef
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-white/80 text-sm">Chefs ativos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">200+</div>
            <div className="text-white/80 text-sm">Eventos realizados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">4.9</div>
            <div className="text-white/80 text-sm">Avaliação média</div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </div>
  );
}