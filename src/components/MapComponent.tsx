
import { useState, useEffect, useRef } from "react";
import { Layers, User, MapIcon, MapPin, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface LayerConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  color: string;
}

interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface Demanda {
  id: string;
  tipo: "regularizacao" | "melhorias";
  descricao: string;
  endereco: string;
  coordenadas: { lat: number; lng: number };
  status: "pendente" | "em_analise" | "aprovado";
  data: string;
  dadosUsuario: {
    nome: string;
    telefone: string;
    email: string;
  };
}

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [showDemandDialog, setShowDemandDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [demandForm, setDemandForm] = useState({
    tipo: "",
    descricao: "",
    nome: "",
    telefone: "",
    email: ""
  });
  const { toast } = useToast();
  
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
      id: "demandas",
      name: "Demandas Cidadãos",
      description: "Solicitações dos cidadãos",
      enabled: true,
      color: "#8b5cf6"
    }
  ]);

  const getUserLocationByIP = async () => {
    try {
      // Usando ipapi.co para obter localização por IP
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const location: UserLocation = {
        lat: data.latitude || -19.7492,
        lng: data.longitude || -47.9292,
        address: `${data.city}, ${data.region}, ${data.country_name}`
      };
      
      setUserLocation(location);
      
      // Centralizar mapa na localização do usuário
      if (window.L && mapContainer.current) {
        const map = (window as any).athisMap;
        if (map) {
          map.setView([location.lat, location.lng], 15);
          
          // Adicionar marcador da localização do usuário
          window.L.marker([location.lat, location.lng], {
            icon: window.L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          })
          .bindPopup(`
            <div>
              <h3><strong>Sua Localização</strong></h3>
              <p>${location.address}</p>
              <button onclick="window.createDemandHere(${location.lat}, ${location.lng})" 
                      style="background: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px;">
                Criar Demanda Aqui
              </button>
            </div>
          `)
          .addTo(map);
        }
      }
      
      toast({
        title: "Localização encontrada!",
        description: `Você está em: ${location.address}`,
      });
      
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      toast({
        title: "Erro na geolocalização",
        description: "Usando localização padrão de Uberaba, MG",
        variant: "destructive"
      });
      
      setUserLocation({
        lat: -19.7492,
        lng: -47.9292,
        address: "Uberaba, MG"
      });
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;

    try {
      // Carregar Leaflet
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        initializeLeafletMap();
      };
      document.head.appendChild(script);

      // Carregar CSS do Leaflet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

    } catch (error) {
      console.error('Erro ao carregar mapa:', error);
    }
  };

  const initializeLeafletMap = () => {
    if (!mapContainer.current || !window.L) return;

    // Inicializar mapa centrado em Uberaba, MG
    const map = window.L.map(mapContainer.current).setView([-19.7492, -47.9292], 13);

    // Salvar referência global do mapa
    (window as any).athisMap = map;

    // Adicionar tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | ATHIS Uberaba'
    }).addTo(map);

    // Adicionar marcador central de Uberaba
    const centerMarker = window.L.marker([-19.7492, -47.9292])
      .bindPopup(`
        <div>
          <h3><strong>ATHIS Uberaba</strong></h3>
          <p>Sistema de Gestão Urbana</p>
          <p><small>Clique no mapa para criar uma demanda</small></p>
        </div>
      `)
      .addTo(map);

    // Adicionar áreas prioritárias
    addPriorityAreas(map);
    
    // Configurar eventos do mapa
    setupMapEvents(map);

    // Função global para criar demanda
    (window as any).createDemandHere = (lat: number, lng: number) => {
      setSelectedLocation({ lat, lng });
      setShowDemandDialog(true);
    };

    setIsMapLoaded(true);
    console.log('Mapa ATHIS inicializado com sucesso!');
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

  const setupMapEvents = (map: any) => {
    map.on('click', (e: any) => {
      if (layers.find(l => l.id === 'demandas')?.enabled) {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        setShowDemandDialog(true);
      }
    });
  };

  const handleSubmitDemand = async () => {
    if (!selectedLocation || !demandForm.tipo || !demandForm.nome) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const novaDemanda: Demanda = {
      id: `DMD-${Date.now()}`,
      tipo: demandForm.tipo as "regularizacao" | "melhorias",
      descricao: demandForm.descricao,
      endereco: `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}`,
      coordenadas: selectedLocation,
      status: "pendente",
      data: new Date().toISOString(),
      dadosUsuario: {
        nome: demandForm.nome,
        telefone: demandForm.telefone,
        email: demandForm.email
      }
    };

    // Salvar no localStorage (simulando banco de dados)
    const demandas = JSON.parse(localStorage.getItem('athis-demandas') || '[]');
    demandas.push(novaDemanda);
    localStorage.setItem('athis-demandas', JSON.stringify(demandas));

    // Adicionar marcador no mapa
    if (window.L && (window as any).athisMap) {
      const map = (window as any).athisMap;
      const icon = demandForm.tipo === 'regularizacao' ? '🏠' : '🔧';
      
      window.L.marker([selectedLocation.lat, selectedLocation.lng])
        .bindPopup(`
          <div>
            <h3><strong>Nova Demanda</strong></h3>
            <p><strong>Tipo:</strong> ${demandForm.tipo === 'regularizacao' ? 'Regularização Fundiária' : 'Melhorias Habitacionais'}</p>
            <p><strong>Solicitante:</strong> ${demandForm.nome}</p>
            <p><strong>Status:</strong> Pendente</p>
            <p><strong>ID:</strong> ${novaDemanda.id}</p>
          </div>
        `)
        .addTo(map);
    }

    toast({
      title: "Demanda criada com sucesso!",
      description: `ID: ${novaDemanda.id} - Aguarde análise da COHAGRA`,
    });

    // Reset form
    setDemandForm({
      tipo: "",
      descricao: "",
      nome: "",
      telefone: "",
      email: ""
    });
    setShowDemandDialog(false);
    setSelectedLocation(null);
  };

  const toggleLayer = (id: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  useEffect(() => {
    initializeMap();
    return () => {
      // Cleanup se necessário
    };
  }, []);

  const activeLayersCount = layers.filter(layer => layer.enabled).length;

  return (
    <div className="flex h-full">
      {/* Painel de Layers ATHIS */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">ATHIS Interativo</h2>
          </div>
          <p className="text-sm text-gray-600">
            {activeLayersCount} de {layers.length} camadas ativas
          </p>
        </div>

        {/* Ferramentas de Localização */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium mb-3">Ferramentas</h3>
          <div className="space-y-2">
            <Button 
              onClick={getUserLocationByIP}
              className="w-full"
              variant="outline"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Localizar Minha Casa
            </Button>
            {userLocation && (
              <div className="text-xs text-gray-600 p-2 bg-blue-50 rounded">
                <strong>Sua localização:</strong><br />
                {userLocation.address}
              </div>
            )}
          </div>
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
              <div>Sistema: Ativo</div>
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
            <MapIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {isMapLoaded ? 'ATHIS Interativo' : 'Carregando...'}
            </span>
          </div>
        </div>

        {/* Instruções */}
        {isMapLoaded && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-700">Clique no mapa para criar demanda</span>
            </div>
          </div>
        )}
      </div>

      {/* Dialog para criar demanda */}
      <Dialog open={showDemandDialog} onOpenChange={setShowDemandDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Nova Demanda ATHIS</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Serviço *</Label>
              <Select value={demandForm.tipo} onValueChange={(value) => setDemandForm(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regularizacao">Regularização Fundiária</SelectItem>
                  <SelectItem value="melhorias">Melhorias Habitacionais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={demandForm.nome}
                onChange={(e) => setDemandForm(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={demandForm.telefone}
                onChange={(e) => setDemandForm(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(34) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={demandForm.email}
                onChange={(e) => setDemandForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição da Necessidade</Label>
              <Textarea
                id="descricao"
                value={demandForm.descricao}
                onChange={(e) => setDemandForm(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva sua situação e necessidades específicas..."
                rows={3}
              />
            </div>

            {selectedLocation && (
              <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                <strong>Coordenadas:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
            )}

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowDemandDialog(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSubmitDemand} className="flex-1">
                Criar Demanda
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapComponent;
