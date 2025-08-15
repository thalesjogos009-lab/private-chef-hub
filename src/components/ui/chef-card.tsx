import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChefCardProps {
  chef: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    priceLevel: number;
    featuredDish: {
      name: string;
      photo: string;
    };
    specialty: string;
  };
  onSelect: (chefId: string) => void;
  className?: string;
}

export function ChefCard({ chef, onSelect, className }: ChefCardProps) {
  const getPriceSymbols = (level: number) => {
    return "$".repeat(level);
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden cursor-pointer w-80 h-96",
        "bg-gradient-card shadow-card border-0",
        "transition-all duration-300 hover:scale-105 hover:shadow-hero",
        "transform-gpu will-change-transform",
        className
      )}
      onClick={() => onSelect(chef.id)}
    >
      {/* Chef Photo */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={chef.photo} 
          alt={chef.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Price Badge */}
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground font-semibold">
          {getPriceSymbols(chef.priceLevel)}
        </Badge>
      </div>

      {/* Chef Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground mb-1">{chef.name}</h3>
          <p className="text-sm text-muted-foreground">{chef.specialty}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <span className="font-medium text-foreground">{chef.rating}</span>
          <span className="text-sm text-muted-foreground">(4.8)</span>
        </div>

        {/* Featured Dish */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
          <img 
            src={chef.featuredDish.photo} 
            alt={chef.featuredDish.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {chef.featuredDish.name}
            </p>
            <p className="text-xs text-muted-foreground">Prato em destaque</p>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </Card>
  );
}