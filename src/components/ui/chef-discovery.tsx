import { useState } from "react";
import { ChefCard } from "./chef-card";
import { Button } from "./button";
import { Input } from "./input";
import { ProfileMenu } from "./profile-menu";
import { Filter, Map, Search } from "lucide-react";
import chefPortrait1 from "@/assets/chef-portrait-1.jpg";
import chefPortrait2 from "@/assets/chef-portrait-2.jpg";
import dishPasta from "@/assets/dish-pasta.jpg";
import dishSalmon from "@/assets/dish-salmon.jpg";

interface ChefDiscoveryProps {
  onChefSelect: (chefId: string) => void;
  onMapView?: () => void;
}

const mockChefs = [
  {
    id: "1",
    name: "Chef Marco Silva",
    photo: chefPortrait1,
    rating: 4.9,
    priceLevel: 3,
    featuredDish: {
      name: "Pasta Trufa Negra",
      photo: dishPasta
    },
    specialty: "Culinária Italiana Contemporânea"
  },
  {
    id: "2", 
    name: "Chef Ana Beatriz",
    photo: chefPortrait2,
    rating: 4.8,
    priceLevel: 2,
    featuredDish: {
      name: "Salmão Grelhado Premium",
      photo: dishSalmon
    },
    specialty: "Frutos do Mar & Peixes"
  },
  {
    id: "3",
    name: "Chef Ricardo Costa",
    photo: chefPortrait1,
    rating: 4.9,
    priceLevel: 3,
    featuredDish: {
      name: "Risotto de Camarão",
      photo: dishPasta
    },
    specialty: "Gastronomia Mediterrânea"
  }
];

export function ChefDiscovery({ onChefSelect, onMapView }: ChefDiscoveryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChefSelect = (chefId: string) => {
    onChefSelect(chefId);
  };

  const filteredChefs = mockChefs.filter(chef =>
    chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chef.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Descobrir Chefs
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por chef ou especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Chef Cards Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {filteredChefs.map((chef) => (
            <ChefCard
              key={chef.id}
              chef={chef}
              onSelect={handleChefSelect}
              className="flex-shrink-0"
            />
          ))}
        </div>

        {filteredChefs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              Nenhum chef encontrado para "{searchTerm}"
            </div>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Limpar busca
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center gap-4 items-center">
            <Button 
              variant="outline" 
              className="flex-1 max-w-32"
              onClick={() => onMapView?.()}
            >
              <Map className="w-4 h-4 mr-2" />
              Mapa
            </Button>
            <ProfileMenu onNavigate={(route) => console.log('Navigate to:', route)} />
            <Button className="flex-1 max-w-48 bg-gradient-primary hover:opacity-90">
              Ver Todos os Chefs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}