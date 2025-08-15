import { useState, useEffect } from "react";
import { ChefHat } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-hero flex items-center justify-center transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-float">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Chef em Casa
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Experiências gastronômicas premium na sua casa
        </p>

        {/* Loading Animation */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />
    </div>
  );
}