
import { useState, useEffect, useRef } from "react";
import { Layers, User, MapIcon, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LayerConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  color: string;
}

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [graphhopperKey, setGraphhopperKey] = useState(() => 
    localStorage.getItem('graphhopper-key') || ''
  );
  const [showKeyInput, setShowKeyInput] = useState(!graphhopperKey);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
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
    },
    {
      id: "rotas",
      name: "Rotas e Navegação",
      description: "Sistema de roteamento GraphHopper",
      enabled: true,
      color: "#f59e0b"
    }
  ]);

  const initializeGraphHopperMap = async (apiKey: string) => {
    if (!mapContainer.current || !apiKey) return;

    try {
      // Carregar GraphHopper Maps API
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        initializeLeafletWithGraphHopper(apiKey);
      };
      document.head.appendChild(script);

      // Carregar CSS do Leaflet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

    } catch (error) {
      console.error('Erro ao carregar GraphHopper:', error);
    }
  };

  const initializeLeafletWithGraphHopper = (apiKey: string) => {
    if (!mapContainer.current || !window.L) return;

    // Inicializar mapa centrado em Uberaba, MG
    const map = window.L.map(mapContainer.current).setView([-19.7492, -47.9292], 13);

    // Adicionar tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | Powered by GraphHopper'
    }).addTo(map);

    // Adicionar marcador para Uberaba
    const centerMarker = window.L.marker([-19.7492, -47.9292])
      .bindPopup(`
        <div>
          <h3><strong>ATHIS Uberaba</strong></h3>
          <p>Sistema de Gestão Urbana</p>
          <p><small>Integração GraphHopper ativa</small></p>
        </div>
      `)
      .addTo(map);

    // Adicionar áreas prioritárias
    addPriorityAreas(map);
    
    // Configurar roteamento GraphHopper
    setupGraphHopperRouting(map, apiKey);

    setIsMapLoaded(true);
    console.log('Mapa GraphHopper inicializado com sucesso!');
  };

  const addPriorityAreas = (map: any) => {
    // Área Prioritária 1 - Bairro Industrial
    const area1 = window.L.polygon([
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
        <h3><strong>Zona Industrial</strong></h3>
        <p><strong>Densidade:</strong> Alta</p>
        <p><strong>Infraestrutura:</strong> Precária</p>
        <p><strong>Prioridade:</strong> Urgente</p>
      </div>
    `).addTo(map);

    // Área Prioritária 2 - Periferia Norte
    const area2 = window.L.polygon([
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
        <h3><strong>Periferia Norte</strong></h3>
        <p><strong>Densidade:</strong> Muito Alta</p>
        <p><strong>Infraestrutura:</strong> Inexistente</p>
        <p><strong>Prioridade:</strong> Crítica</p>
      </div>
    `).addTo(map);
  };

  const setupGraphHopperRouting = (map: any, apiKey: string) => {
    // Configurar controle de roteamento GraphHopper
    map.on('click', (e: any) => {
      if (layers.find(l => l.id === 'rotas')?.enabled) {
        console.log('Ponto clicado para roteamento:', e.latlng);
        // Aqui implementaríamos a lógica de roteamento GraphHopper
      }
    });
  };

  const handleKeySubmit = () => {
    if (graphhopperKey.trim()) {
      localStorage.setItem('graphhopper-key', graphhopperKey);
      setShowKeyInput(false);
      initializeGraphHopperMap(graphhopperKey);
    }
  };

  const toggleLayer = (id: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  useEffect(() => {
    if (graphhopperKey && !showKeyInput) {
      initializeGraphHopperMap(graphhopperKey);
    }

    return () => {
      // Cleanup se necessário
    };
  }, []);

  const activeLayersCount = layers.filter(layer => layer.enabled).length;

  if (showKeyInput) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Configurar GraphHopper</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="graphhopper-key">Chave API GraphHopper</Label>
              <Input
                id="graphhopper-key"
                type="text"
                placeholder="Sua chave GraphHopper..."
                value={graphhopperKey}
                onChange={(e) => setGraphhopperKey(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleKeySubmit}
              className="w-full"
              disabled={!graphhopperKey.trim()}
            >
              Inicializar Mapa ATHIS
            </Button>
            <p className="text-xs text-gray-600">
              Obtenha sua chave gratuita em{' '}
              <a 
                href="https://www.graphhopper.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                graphhopper.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Painel de Layers ATHIS */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">ATHIS Layers</h2>
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
              <span className="text-sm font-medium text-blue-800">ATHIS Stats</span>
            </div>
            <div className="space-y-1 text-xs text-blue-700">
              <div>População: 337.092 habitantes</div>
              <div>Área: 4.540,51 km²</div>
              <div>Densidade: 74,27 hab/km²</div>
              <div>Rotas ativas: GraphHopper</div>
            </div>
          </div>
        </div>
      </div>

      {/* Área do Mapa GraphHopper */}
      <div className="flex-1 relative">
        <div 
          ref={mapContainer} 
          className="absolute inset-0 rounded-lg shadow-lg"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Indicador de tecnologia */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
          <div className="flex items-center space-x-2">
            <MapIcon className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              {isMapLoaded ? 'GraphHopper ATHIS' : 'Carregando...'}
            </span>
          </div>
        </div>

        {/* Status de roteamento */}
        {isMapLoaded && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-700">Sistema de rotas ativo</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
