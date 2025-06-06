
import { useState, useEffect, useRef } from "react";
import { Layers, User, MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LayerConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  color: string;
}

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const areasLayer = useRef<L.LayerGroup | null>(null);
  
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

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    // Inicializar mapa centrado em Uberaba, MG
    map.current = L.map(mapContainer.current).setView([-19.7492, -47.9292], 13);

    // Adicionar tile layer do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Criar grupos de camadas
    markersLayer.current = L.layerGroup().addTo(map.current);
    areasLayer.current = L.layerGroup().addTo(map.current);

    // Adicionar marcador para o centro de Uberaba
    const centerMarker = L.marker([-19.7492, -47.9292])
      .bindPopup('<strong>Uberaba, MG</strong><br>Centro da cidade')
      .addTo(markersLayer.current);

    // Adicionar áreas prioritárias
    addPriorityAreas();

    console.log('Mapa OpenStreetMap carregado com sucesso!');
  };

  const addPriorityAreas = () => {
    if (!map.current || !areasLayer.current) return;

    // Área Prioritária 1
    const area1 = L.polygon([
      [-19.740, -47.940],
      [-19.740, -47.935],
      [-19.745, -47.935],
      [-19.745, -47.940]
    ], {
      color: '#dc2626',
      fillColor: '#ef4444',
      fillOpacity: 0.6
    }).bindPopup(`
      <div>
        <h3><strong>Área Prioritária 1</strong></h3>
        <p><strong>Densidade:</strong> Alta</p>
        <p><strong>Infraestrutura:</strong> Precária</p>
      </div>
    `);

    // Área Prioritária 2
    const area2 = L.polygon([
      [-19.755, -47.925],
      [-19.755, -47.920],
      [-19.760, -47.920],
      [-19.760, -47.925]
    ], {
      color: '#dc2626',
      fillColor: '#ef4444',
      fillOpacity: 0.6
    }).bindPopup(`
      <div>
        <h3><strong>Área Prioritária 2</strong></h3>
        <p><strong>Densidade:</strong> Muito Alta</p>
        <p><strong>Infraestrutura:</strong> Inexistente</p>
      </div>
    `);

    area1.addTo(areasLayer.current);
    area2.addTo(areasLayer.current);
  };

  const toggleLayer = (id: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      )
    );

    // Controlar visibilidade das camadas
    if (map.current && areasLayer.current && markersLayer.current) {
      const layer = layers.find(l => l.id === id);
      if (id === 'prioritarias') {
        if (layer?.enabled) {
          map.current.removeLayer(areasLayer.current);
        } else {
          map.current.addLayer(areasLayer.current);
        }
      }
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const activeLayersCount = layers.filter(layer => layer.enabled).length;

  return (
    <div className="flex h-full">
      {/* Painel de Layers */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Layers className="w-5 h-5 text-blue-600" />
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
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Estatísticas</span>
            </div>
            <div className="space-y-1 text-xs text-blue-700">
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
        
        {/* Indicador de tecnologia */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
          <div className="flex items-center space-x-2">
            <MapIcon className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">OpenStreetMap</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
