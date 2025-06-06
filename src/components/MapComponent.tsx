
import { useState, useEffect, useRef } from "react";
import { Layers, User, Map as MapIcon, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LayerConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  color: string;
}

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState(() => 
    localStorage.getItem('mapbox-token') || ''
  );
  const [showTokenInput, setShowTokenInput] = useState(!mapboxToken);
  const [layers, setLayers] = useState<LayerConfig[]>([
    {
      id: "densidade",
      name: "Densidade Populacional",
      description: "Concentração de habitantes por área",
      enabled: true,
      color: "#0ea5e9"
    },
    {
      id: "infraestrutura",
      name: "Infraestrutura",
      description: "Redes de água, esgoto e energia",
      enabled: false,
      color: "#22c55e"
    },
    {
      id: "prioritarias",
      name: "Áreas Prioritárias",
      description: "Regiões de intervenção urgente",
      enabled: true,
      color: "#ef4444"
    },
    {
      id: "transporte",
      name: "Transporte Público",
      description: "Linhas de ônibus e pontos de parada",
      enabled: false,
      color: "#8b5cf6"
    }
  ]);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-47.9292, -19.7492], // Coordenadas de Uberaba, MG
      zoom: 12,
      pitch: 0,
      bearing: 0
    });

    // Adicionar controles de navegação
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Adicionar controle de escala
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Adicionar marcador central para Uberaba
    new mapboxgl.Marker({
      color: '#ef4444'
    })
    .setLngLat([-47.9292, -19.7492])
    .setPopup(new mapboxgl.Popup().setHTML('<h3>Uberaba, MG</h3><p>Centro da cidade</p>'))
    .addTo(map.current);

    // Configurar eventos do mapa
    map.current.on('load', () => {
      console.log('Mapa carregado com sucesso!');
      addDataLayers();
    });
  };

  const addDataLayers = () => {
    if (!map.current) return;

    // Adicionar fonte de dados simulada para áreas prioritárias
    map.current.addSource('areas-prioritarias', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-47.940, -19.740],
                [-47.935, -19.740],
                [-47.935, -19.745],
                [-47.940, -19.745],
                [-47.940, -19.740]
              ]]
            },
            properties: {
              name: 'Área Prioritária 1',
              densidade: 'Alta',
              infraestrutura: 'Precária'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-47.925, -19.755],
                [-47.920, -19.755],
                [-47.920, -19.760],
                [-47.925, -19.760],
                [-47.925, -19.755]
              ]]
            },
            properties: {
              name: 'Área Prioritária 2',
              densidade: 'Muito Alta',
              infraestrutura: 'Inexistente'
            }
          }
        ]
      }
    });

    // Adicionar camada de áreas prioritárias
    map.current.addLayer({
      id: 'areas-prioritarias-layer',
      type: 'fill',
      source: 'areas-prioritarias',
      paint: {
        'fill-color': '#ef4444',
        'fill-opacity': 0.6
      }
    });

    // Adicionar bordas das áreas prioritárias
    map.current.addLayer({
      id: 'areas-prioritarias-outline',
      type: 'line',
      source: 'areas-prioritarias',
      paint: {
        'line-color': '#dc2626',
        'line-width': 2
      }
    });

    // Adicionar popup ao clicar nas áreas
    map.current.on('click', 'areas-prioritarias-layer', (e) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${feature.properties?.name}</h3>
              <p><strong>Densidade:</strong> ${feature.properties?.densidade}</p>
              <p><strong>Infraestrutura:</strong> ${feature.properties?.infraestrutura}</p>
            </div>
          `)
          .addTo(map.current!);
      }
    });

    // Alterar cursor ao passar sobre as áreas
    map.current.on('mouseenter', 'areas-prioritarias-layer', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    });

    map.current.on('mouseleave', 'areas-prioritarias-layer', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox-token', mapboxToken);
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };

  const toggleLayer = (id: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      )
    );

    // Aqui você pode adicionar lógica para mostrar/ocultar camadas no mapa
    if (map.current) {
      const visibility = layers.find(l => l.id === id)?.enabled ? 'none' : 'visible';
      if (id === 'prioritarias') {
        map.current.setLayoutProperty('areas-prioritarias-layer', 'visibility', visibility);
        map.current.setLayoutProperty('areas-prioritarias-outline', 'visibility', visibility);
      }
    }
  };

  useEffect(() => {
    if (mapboxToken && !showTokenInput) {
      initializeMap(mapboxToken);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const activeLayersCount = layers.filter(layer => layer.enabled).length;

  if (showTokenInput) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Configurar Mapbox</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mapbox-token">Token Público do Mapbox</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1IjoiZXhhbXBsZS..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Obtenha seu token em{' '}
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <Button onClick={handleTokenSubmit} className="w-full">
              Inicializar Mapa
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Painel de Layers */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Layers className="w-5 h-5 text-athis-600" />
            <h2 className="text-lg font-semibold text-gray-900">Camadas do Mapa</h2>
          </div>
          <p className="text-sm text-gray-600">
            {activeLayersCount} de {layers.length} camadas ativas
          </p>
        </div>

        <div className="p-4 space-y-4">
          {layers.map((layer) => (
            <Card key={layer.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                    <CardTitle className="text-sm font-medium">{layer.name}</CardTitle>
                  </div>
                  <Switch
                    checked={layer.enabled}
                    onCheckedChange={() => toggleLayer(layer.id)}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600">{layer.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-athis-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-athis-600" />
              <span className="text-sm font-medium text-athis-800">Estatísticas</span>
            </div>
            <div className="space-y-1 text-xs text-athis-700">
              <div>População: 337.092 habitantes</div>
              <div>Área: 4.540,51 km²</div>
              <div>Densidade: 74,27 hab/km²</div>
            </div>
          </div>
        </div>
      </div>

      {/* Área do Mapa */}
      <div className="flex-1 relative">
        <div 
          ref={mapContainer} 
          className="absolute inset-0 rounded-lg shadow-lg"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Botão para reconfigurar token */}
        <Button
          onClick={() => setShowTokenInput(true)}
          variant="outline"
          size="sm"
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm"
        >
          <Key className="w-4 h-4 mr-2" />
          Configurar Token
        </Button>
      </div>
    </div>
  );
};

export default MapComponent;
