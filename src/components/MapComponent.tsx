
import { useState } from "react";
import { Layers, User, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LayerConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  color: string;
}

const MapComponent = () => {
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

  const toggleLayer = (id: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  const activeLayersCount = layers.filter(layer => layer.enabled).length;

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
        <div className="absolute inset-0 map-container flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <MapIcon className="w-12 h-12 text-athis-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mapa Interativo de Uberaba</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Visualize as camadas de dados urbanos para análise estratégica do programa ATHIS.
              Ative as camadas no painel lateral para explorar diferentes aspectos da cidade.
            </p>
            <div className="mt-6 flex justify-center space-x-3">
              {layers.filter(l => l.enabled).map((layer) => (
                <div key={layer.id} className="flex items-center space-x-1 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="text-xs text-gray-700">{layer.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controles do Mapa */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white">
            Zoom +
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white">
            Zoom -
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
