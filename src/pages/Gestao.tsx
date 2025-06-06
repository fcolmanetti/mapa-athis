
import { useState, useEffect } from "react";
import { MapIcon, User, Calendar, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Demanda {
  id: string;
  tipo: "regularizacao" | "melhorias";
  descricao: string;
  endereco: string;
  coordenadas: { lat: number; lng: number };
  status: "pendente" | "em_analise" | "aprovado" | "rejeitado";
  data: string;
  dadosUsuario: {
    nome: string;
    telefone: string;
    email: string;
  };
}

const Gestao = () => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar demandas do localStorage
    const demandasSalvas = JSON.parse(localStorage.getItem('athis-demandas') || '[]');
    setDemandas(demandasSalvas);
  }, []);

  const updateDemandaStatus = (id: string, novoStatus: "em_analise" | "aprovado" | "rejeitado") => {
    const demandasAtualizadas = demandas.map(demanda => 
      demanda.id === id ? { ...demanda, status: novoStatus } : demanda
    );
    
    setDemandas(demandasAtualizadas);
    localStorage.setItem('athis-demandas', JSON.stringify(demandasAtualizadas));
    
    const statusTexto = {
      em_analise: "Em Análise",
      aprovado: "Aprovado",
      rejeitado: "Rejeitado"
    };
    
    toast({
      title: "Status atualizado",
      description: `Demanda ${id} alterada para: ${statusTexto[novoStatus]}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em_analise": return "bg-blue-100 text-blue-800";
      case "aprovado": return "bg-green-100 text-green-800";
      case "rejeitado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "em_analise": return "Em Análise";
      case "aprovado": return "Aprovado";
      case "rejeitado": return "Rejeitado";
      default: return "Desconhecido";
    }
  };

  const getTipoText = (tipo: string) => {
    return tipo === "regularizacao" ? "Regularização Fundiária" : "Melhorias Habitacionais";
  };

  const stats = {
    total: demandas.length,
    pendentes: demandas.filter(d => d.status === "pendente").length,
    emAnalise: demandas.filter(d => d.status === "em_analise").length,
    aprovadas: demandas.filter(d => d.status === "aprovado").length,
    rejeitadas: demandas.filter(d => d.status === "rejeitado").length,
    regularizacao: demandas.filter(d => d.tipo === "regularizacao").length,
    melhorias: demandas.filter(d => d.tipo === "melhorias").length
  };

  const filtrarDemandas = (status?: string) => {
    if (!status || status === "todas") return demandas;
    return demandas.filter(d => d.status === status);
  };

  const abrirDetalhes = (demanda: Demanda) => {
    setSelectedDemanda(demanda);
    setShowDetailDialog(true);
  };

  const abrirNoMapa = (coordenadas: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps?q=${coordenadas.lat},${coordenadas.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <MapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão COHAGRA</h1>
              <p className="text-gray-600">Administração de demandas do mapa interativo ATHIS</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Demandas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MapIcon className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendentes}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Análise</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.emAnalise}</p>
                </div>
                <User className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-3xl font-bold text-green-600">{stats.aprovadas}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas por Tipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Regularização Fundiária</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.regularizacao}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {((stats.regularizacao / stats.total) * 100 || 0).toFixed(1)}% do total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Melhorias Habitacionais</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.melhorias}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {((stats.melhorias / stats.total) * 100 || 0).toFixed(1)}% do total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Demandas */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Gerenciamento de Demandas</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="todas" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="todas">Todas ({stats.total})</TabsTrigger>
                <TabsTrigger value="pendente">Pendentes ({stats.pendentes})</TabsTrigger>
                <TabsTrigger value="em_analise">Em Análise ({stats.emAnalise})</TabsTrigger>
                <TabsTrigger value="aprovado">Aprovadas ({stats.aprovadas})</TabsTrigger>
                <TabsTrigger value="rejeitado">Rejeitadas ({stats.rejeitadas})</TabsTrigger>
              </TabsList>
              
              {["todas", "pendente", "em_analise", "aprovado", "rejeitado"].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtrarDemandas(tabValue).map((demanda) => (
                        <TableRow key={demanda.id}>
                          <TableCell className="font-medium">{demanda.id}</TableCell>
                          <TableCell>{demanda.dadosUsuario.nome}</TableCell>
                          <TableCell>{getTipoText(demanda.tipo)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(demanda.status)}>
                              {getStatusText(demanda.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(demanda.data).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => abrirDetalhes(demanda)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => abrirNoMapa(demanda.coordenadas)}
                              >
                                <MapIcon className="w-4 h-4" />
                              </Button>
                              {demanda.status === "pendente" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => updateDemandaStatus(demanda.id, "em_analise")}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Analisar
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    onClick={() => updateDemandaStatus(demanda.id, "aprovado")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Aprovar
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => updateDemandaStatus(demanda.id, "rejeitado")}
                                  >
                                    Rejeitar
                                  </Button>
                                </>
                              )}
                              {demanda.status === "em_analise" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => updateDemandaStatus(demanda.id, "aprovado")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Aprovar
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => updateDemandaStatus(demanda.id, "rejeitado")}
                                  >
                                    Rejeitar
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filtrarDemandas(tabValue).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhuma demanda encontrada nesta categoria.
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Dialog de Detalhes */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Demanda</DialogTitle>
          </DialogHeader>
          
          {selectedDemanda && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>ID:</strong> {selectedDemanda.id}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <Badge className={getStatusColor(selectedDemanda.status)}>
                    {getStatusText(selectedDemanda.status)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <strong>Tipo de Serviço:</strong> {getTipoText(selectedDemanda.tipo)}
              </div>
              
              <div>
                <strong>Solicitante:</strong> {selectedDemanda.dadosUsuario.nome}
              </div>
              
              {selectedDemanda.dadosUsuario.telefone && (
                <div>
                  <strong>Telefone:</strong> {selectedDemanda.dadosUsuario.telefone}
                </div>
              )}
              
              {selectedDemanda.dadosUsuario.email && (
                <div>
                  <strong>E-mail:</strong> {selectedDemanda.dadosUsuario.email}
                </div>
              )}
              
              <div>
                <strong>Coordenadas:</strong> {selectedDemanda.coordenadas.lat.toFixed(6)}, {selectedDemanda.coordenadas.lng.toFixed(6)}
              </div>
              
              <div>
                <strong>Data da Solicitação:</strong> {new Date(selectedDemanda.data).toLocaleDateString('pt-BR')} às {new Date(selectedDemanda.data).toLocaleTimeString('pt-BR')}
              </div>
              
              {selectedDemanda.descricao && (
                <div>
                  <strong>Descrição:</strong>
                  <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedDemanda.descricao}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => abrirNoMapa(selectedDemanda.coordenadas)}
                  className="flex-1"
                >
                  <MapIcon className="w-4 h-4 mr-2" />
                  Ver no Mapa
                </Button>
                <Button 
                  onClick={() => setShowDetailDialog(false)}
                  className="flex-1"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gestao;
