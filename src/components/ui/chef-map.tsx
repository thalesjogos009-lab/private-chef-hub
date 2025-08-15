import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Users, Key, Eye, EyeOff } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyChefs, setNearbyChefs] = useState<ChefLocation[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

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

  const initializeMap = () => {
    if (!mapContainer.current || !userLocation || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [userLocation.lng, userLocation.lat],
      zoom: 12,
      pitch: 30,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setIsMapReady(true);
      addChefMarkers();
      addServiceRadiuses();
    });
  };

  const addChefMarkers = () => {
    if (!map.current) return;

    mockChefs.forEach(chef => {
      // Create chef marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'chef-marker';
      markerEl.style.backgroundImage = `url(${chef.photo})`;
      markerEl.style.width = '50px';
      markerEl.style.height = '50px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.backgroundSize = 'cover';
      markerEl.style.backgroundPosition = 'center';
      markerEl.style.border = '3px solid white';
      markerEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
      markerEl.style.cursor = 'pointer';
      markerEl.style.transition = 'transform 0.2s';

      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.1)';
      });

      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)';
      });

      markerEl.addEventListener('click', () => {
        onChefSelect(chef.id);
      });

      // Add marker to map
      new mapboxgl.Marker(markerEl)
        .setLngLat([chef.lng, chef.lat])
        .addTo(map.current!);

      // Add popup with chef info
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div style="padding: 8px; text-align: center;">
          <h4 style="margin: 0 0 4px 0; font-weight: bold;">${chef.name}</h4>
          <p style="margin: 0; font-size: 12px; color: #666;">${chef.specialty}</p>
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 4px;">
            <span style="color: #f59e0b;">⭐</span>
            <span style="font-size: 12px;">${chef.rating}</span>
          </div>
        </div>
      `);

      markerEl.addEventListener('mouseenter', () => {
        popup.setLngLat([chef.lng, chef.lat]).addTo(map.current!);
      });

      markerEl.addEventListener('mouseleave', () => {
        popup.remove();
      });
    });
  };

  const addServiceRadiuses = () => {
    if (!map.current) return;

    mockChefs.forEach((chef, index) => {
      const radiusInMeters = chef.serviceRadius * 1000;
      
      // Add pulsing circle source
      map.current!.addSource(`chef-radius-${chef.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [chef.lng, chef.lat]
          },
          properties: {}
        }
      });

      // Add circle layer with pulsing effect
      map.current!.addLayer({
        id: `chef-radius-${chef.id}`,
        type: 'circle',
        source: `chef-radius-${chef.id}`,
        paint: {
          'circle-radius': {
            base: 1.75,
            stops: [
              [12, radiusInMeters / 100],
              [22, radiusInMeters / 10]
            ]
          },
          'circle-color': index % 2 === 0 ? '#f59e0b' : '#ef4444',
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0.1,
            15, 0.2
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': index % 2 === 0 ? '#f59e0b' : '#ef4444',
          'circle-stroke-opacity': 0.6
        }
      });

      // Add pulsing animation
      let opacity = 0.1;
      let direction = 1;
      
      const pulseAnimation = () => {
        if (!map.current || !map.current.getLayer(`chef-radius-${chef.id}`)) return;
        
        opacity += direction * 0.01;
        if (opacity >= 0.3) direction = -1;
        if (opacity <= 0.1) direction = 1;

        map.current!.setPaintProperty(`chef-radius-${chef.id}`, 'circle-opacity', opacity);
        requestAnimationFrame(pulseAnimation);
      };

      setTimeout(() => pulseAnimation(), index * 500); // Stagger animations
    });
  };

  useEffect(() => {
    if (mapboxToken && userLocation && showTokenInput === false) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, userLocation, showTokenInput]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 p-6">
          <div className="text-center mb-6">
            <Key className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Configurar Mapbox</h2>
            <p className="text-sm text-muted-foreground">
              Para exibir o mapa, insira sua chave pública do Mapbox.
              <br />
              <a 
                href="https://mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Obtenha sua chave aqui
              </a>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <div className="relative mt-1">
                <Input
                  id="mapbox-token"
                  type={showToken ? "text" : "password"}
                  placeholder="pk.eyJ1IjoibXl1c2VybmFtZSI..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleTokenSubmit}
                disabled={!mapboxToken.trim()}
                className="flex-1 bg-gradient-primary"
              >
                Continuar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
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