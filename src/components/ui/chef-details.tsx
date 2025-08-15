import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, Clock, MapPin, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import chefPortrait1 from "@/assets/chef-portrait-1.jpg";
import dishPasta from "@/assets/dish-pasta.jpg";
import dishSalmon from "@/assets/dish-salmon.jpg";

interface ChefDetailsProps {
  chefId: string;
  onBack: () => void;
  onBooking: () => void;
}

const mockChefData = {
  id: "1",
  name: "Chef Marco Silva",
  photo: chefPortrait1,
  rating: 4.9,
  reviewCount: 127,
  priceLevel: 3,
  specialty: "Culinária Italiana Contemporânea",
  bio: "Chef formado pela Le Cordon Bleu com mais de 15 anos de experiência em restaurantes premiados. Especialista em harmonizar tradição italiana com técnicas modernas.",
  serviceArea: "São Paulo - Zona Sul e Centro",
  availability: "Disponível hoje",
  dishes: [
    {
      id: "1",
      name: "Pasta Trufa Negra",
      photo: dishPasta,
      description: "Massa artesanal com molho de trufa negra, parmesão aged e ervas frescas",
      ingredients: ["Massa fresca", "Trufa negra", "Parmesão", "Manteiga"],
      prepTime: "25 min",
      pricePerPerson: 85
    },
    {
      id: "2", 
      name: "Salmão Grelhado Premium",
      photo: dishSalmon,
      description: "Salmão norueguês grelhado com vegetais da estação e molho de ervas",
      ingredients: ["Salmão norueguês", "Aspargos", "Molho de ervas", "Limão siciliano"],
      prepTime: "20 min",
      pricePerPerson: 95
    }
  ],
  reviews: [
    {
      id: "1",
      userName: "Ana Carolina",
      rating: 5,
      comment: "Experiência incrível! O Chef Marco superou todas as expectativas. Pratos deliciosos e apresentação impecável.",
      date: "há 2 dias"
    },
    {
      id: "2",
      userName: "Roberto Santos",
      rating: 5,
      comment: "Jantar perfeito para nosso aniversário de casamento. Recomendo demais!",
      date: "há 1 semana"
    }
  ]
};

export function ChefDetails({ chefId, onBack, onBooking }: ChefDetailsProps) {
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const chef = mockChefData; // In real app, fetch by chefId

  const handleScroll = (e: React.UIEvent) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const getPriceSymbols = (level: number) => {
    return "$".repeat(level);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b transition-all duration-300",
        scrollY > 100 ? "py-2" : "py-4"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            {scrollY > 100 && (
              <div className="flex items-center gap-3">
                <img 
                  src={chef.photo} 
                  alt={chef.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm">{chef.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-xs">{chef.rating}</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={cn(
                "w-4 h-4", 
                isFavorite ? "fill-accent text-accent" : "text-muted-foreground"
              )} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-24" onScroll={handleScroll}>
        {/* Chef Profile Header */}
        <div className="py-6">
          <div className="flex gap-6 mb-6">
            <img 
              src={chef.photo} 
              alt={chef.name}
              className="w-24 h-24 rounded-full object-cover shadow-card"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1">{chef.name}</h1>
              <p className="text-muted-foreground mb-2">{chef.specialty}</p>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-medium">{chef.rating}</span>
                  <span className="text-sm text-muted-foreground">({chef.reviewCount} avaliações)</span>
                </div>
                <Badge variant="secondary">{getPriceSymbols(chef.priceLevel)}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{chef.serviceArea}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>{chef.availability}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">{chef.bio}</p>
        </div>

        {/* Recipe Cards Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Cartas de Receitas</h2>
          <div className="grid gap-4">
            {chef.dishes.map((dish) => (
              <Card 
                key={dish.id}
                className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-card"
                onClick={() => setSelectedDish(dish.id)}
              >
                <div className="flex gap-4 p-4">
                  <img 
                    src={dish.photo} 
                    alt={dish.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{dish.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {dish.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dish.prepTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Por pessoa
                        </div>
                      </div>
                      <span className="font-bold text-primary">R$ {dish.pricePerPerson}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Avaliações</h2>
          <div className="space-y-4">
            {chef.reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">{review.userName}</h4>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Booking Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4">
        <Button 
          className="w-full bg-gradient-accent hover:shadow-accent font-semibold"
          size="lg"
          onClick={onBooking}
        >
          Agendar Cozinheiro
        </Button>
      </div>
    </div>
  );
}