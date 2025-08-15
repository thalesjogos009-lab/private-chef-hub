import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import chefPortrait1 from "@/assets/chef-portrait-1.jpg";
import chefPortrait2 from "@/assets/chef-portrait-2.jpg";

interface ChefMapProps {
  onBack: () => void;
  onChefSelect: (chefId: string) => void;
}

interface ChefLocation {
  id: string;
  name: string;
  photo: string;
  lat: number;
  lng: number;
  serviceRadius: number; // em km
  rating: number;
  specialty: string;
}

const mockChefs: ChefLocation[] = [
  {
    id: "1",
    name: "Chef Marco Silva",
    photo: chefPortrait1,
    lat: -23.5489,
    lng: -46.6388,
    serviceRadius: 15,
    rating: 4.9,
    specialty: "Culinária Italiana"
  },
  {
    id: "2",
    name: "Chef Ana Beatriz",
    photo: chefPortrait2,
    lat: -23.5505,
    lng: -46.6333,
    serviceRadius: 10,
    rating: 4.8,
    specialty: "Frutos do Mar"
  },
  {
    id: "3",
    name: "Chef Ricardo Costa",
    photo: chefPortrait1,
    lat: -23.5525,
    lng: -46.6417,
    serviceRadius: 20,
    rating: 4.9,
    specialty: "Gastronomia Mediterrânea"
  },
  {
    id: "4", 
    name: "Chef Isabella Santos",
    photo: chefPortrait2,
    lat: -23.5475,
    lng: -46.6365,
    serviceRadius: 12,
    rating: 4.7,
    specialty: "Culinária Vegana"
  }
];

export function ChefMap({ onBack, onChefSelect }: ChefMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyChefs, setNearbyChefs] = useState<ChefLocation[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);
  const circlesRef = useRef<L.Circle[]>([]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to São Paulo center if location denied
          setUserLocation({
            lat: -23.5489,
            lng: -46.6388
          });
        }
      );
    } else {
      // Fallback to São Paulo center
      setUserLocation({
        lat: -23.5489,
        lng: -46.6388
      });
    }
  }, []);

  // Calculate nearby chefs
  useEffect(() => {
    if (userLocation) {
      const chefsInRange = mockChefs.filter(chef => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          chef.lat,
          chef.lng
        );
        return distance <= chef.serviceRadius;
      });
      setNearbyChefs(chefsInRange);
    }
  }, [userLocation]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const createChefIcon = (chef: ChefLocation) => {
    const iconHtml = `
      <div style="
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        background-image: url('${chef.photo}');
        background-size: cover;
        background-position: center;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <div style="
          position: absolute;
          bottom: -8px;
          right: -8px;
          background: #f59e0b;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          border: 2px solid white;
        ">
          ${chef.rating}
        </div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'chef-marker',
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25]
    });
  };

  const initializeMap = () => {
    if (!mapContainer.current || !userLocation) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([userLocation.lat, userLocation.lng], 13);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Add user location marker
    const userIcon = L.divIcon({
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'user-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map.current)
      .bindPopup('Sua localização')
      .openPopup();

    // Add chef markers and service areas
    addChefMarkers();
    setIsMapReady(true);
  };

  const addChefMarkers = () => {
    if (!map.current) return;

    // Clear existing markers and circles
    markersRef.current.forEach(marker => marker.remove());
    circlesRef.current.forEach(circle => circle.remove());
    markersRef.current = [];
    circlesRef.current = [];

    mockChefs.forEach((chef, index) => {
      // Add service radius circle with pulsing effect
      const circle = L.circle([chef.lat, chef.lng], {
        color: index % 2 === 0 ? '#f59e0b' : '#ef4444',
        fillColor: index % 2 === 0 ? '#f59e0b' : '#ef4444',
        fillOpacity: 0.1,
        radius: chef.serviceRadius * 1000, // Convert km to meters
        weight: 2,
        opacity: 0.6
      }).addTo(map.current!);

      circlesRef.current.push(circle);

      // Add pulsing animation
      let opacity = 0.1;
      let direction = 1;
      
      const pulseInterval = setInterval(() => {
        if (!map.current || !circle) {
          clearInterval(pulseInterval);
          return;
        }
        
        opacity += direction * 0.005;
        if (opacity >= 0.25) direction = -1;
        if (opacity <= 0.05) direction = 1;

        circle.setStyle({ fillOpacity: opacity });
      }, 50);

      // Add chef marker
      const marker = L.marker([chef.lat, chef.lng], { 
        icon: createChefIcon(chef) 
      }).addTo(map.current!);

      const popupContent = `
        <div style="text-align: center; padding: 8px; min-width: 150px;">
          <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #374151;">${chef.name}</h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">${chef.specialty}</p>
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 8px;">
            <span style="color: #f59e0b;">⭐</span>
            <span style="font-size: 12px; color: #374151;">${chef.rating}</span>
            <span style="font-size: 10px; color: #9ca3af;">• ${chef.serviceRadius}km</span>
          </div>
          <button 
            onclick="window.selectChef('${chef.id}')"
            style="
              background: linear-gradient(135deg, #f59e0b, #f97316);
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              cursor: pointer;
              transition: opacity 0.2s;
            "
            onmouseover="this.style.opacity='0.9'"
            onmouseout="this.style.opacity='1'"
          >
            Ver Perfil
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 200,
        className: 'chef-popup'
      });

      // Add hover effects
      marker.on('mouseover', () => {
        marker.openPopup();
      });

      markersRef.current.push(marker);
    });
  };

  // Global function to handle chef selection from popup
  useEffect(() => {
    (window as any).selectChef = (chefId: string) => {
      onChefSelect(chefId);
    };

    return () => {
      delete (window as any).selectChef;
    };
  }, [onChefSelect]);

  useEffect(() => {
    if (userLocation) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-lg font-semibold ml-4">Mapa de Chefs</h1>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {userLocation 
                  ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                  : 'Localizando...'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {!isMapReady && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando mapa...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats */}
      <div className="bg-background/95 backdrop-blur-sm border-t p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">
                {nearbyChefs.length} chef{nearbyChefs.length !== 1 ? 's' : ''} nas proximidades
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Toque em um chef para ver o perfil
            </div>
          </div>

          {nearbyChefs.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {nearbyChefs.map(chef => (
                  <div 
                    key={chef.id}
                    className="flex items-center gap-2 bg-secondary/50 rounded-full px-3 py-1 text-xs cursor-pointer hover:bg-secondary/70 transition-colors"
                    onClick={() => onChefSelect(chef.id)}
                  >
                    <img 
                      src={chef.photo} 
                      alt={chef.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{chef.name}</span>
                    <span className="text-muted-foreground">
                      {chef.serviceRadius}km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}