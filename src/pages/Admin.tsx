
import { useState } from "react";
import { Calendar, User, MapIcon, File } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Solicitacao {
  id: string;
  nome: string;
  endereco: string;
  status: "pendente" | "em_analise" | "aprovado" | "rejeitado";
  data: string;
  rendaFamiliar: number;
}

const Admin = () => {
  const [solicitacoes] = useState<Solicitacao[]>([
    {
      id: "001",
      nome: "Maria Silva Santos",
      endereco: "Rua das Flores, 123 - Centro",
      status: "pendente",
      data: "2024-06-01",
      rendaFamiliar: 2400
    },
    {
      id: "002",
      nome: "João Pedro Oliveira",
      endereco: "Av. Brasil, 456 - Jardim Paulista",
      status: "em_analise",
      data: "2024-06-02",
      rendaFamiliar: 1800
    },
    {
      id: "003",
      nome: "Ana Carolina Lima",
      endereco: "Rua São José, 789 - Vila Nova",
      status: "aprovado",
      data: "2024-05-28",
      rendaFamiliar: 2100
    }
  ]);

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

  const stats = {
    totalSolicitacoes: solicitacoes.length,
    pendentes: solicitacoes.filter(s => s.status === "pendente").length,
    aprovadas: solicitacoes.filter(s => s.status === "aprovado").length,
    emAnalise: solicitacoes.filter(s => s.status === "em_analise").length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-athis-500 to-urban-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Gestão de solicitações ATHIS</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Solicitações</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalSolicitacoes}</p>
                </div>
                <File className="w-8 h-8 text-athis-500" />
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
                <Calendar className="w-8 h-8 text-yellow-500" />
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
                <MapIcon className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Solicitações */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Solicitações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="todas" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                <TabsTrigger value="em_analise">Em Análise</TabsTrigger>
                <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="todas" className="mt-6">
                <div className="space-y-4">
                  {solicitacoes.map((solicitacao) => (
                    <div key={solicitacao.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{solicitacao.nome}</h3>
                            <Badge className={getStatusColor(solicitacao.status)}>
                              {getStatusText(solicitacao.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{solicitacao.endereco}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>ID: {solicitacao.id}</span>
                            <span>Data: {new Date(solicitacao.data).toLocaleDateString('pt-BR')}</span>
                            <span>Renda: R$ {solicitacao.rendaFamiliar.toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                          {solicitacao.status === "pendente" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Aprovar
                              </Button>
                              <Button variant="destructive" size="sm">
                                Rejeitar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pendentes">
                <div className="space-y-4">
                  {solicitacoes.filter(s => s.status === "pendente").map((solicitacao) => (
                    <div key={solicitacao.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium">{solicitacao.nome}</h3>
                      <p className="text-sm text-gray-600">{solicitacao.endereco}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="em_analise">
                <div className="space-y-4">
                  {solicitacoes.filter(s => s.status === "em_analise").map((solicitacao) => (
                    <div key={solicitacao.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium">{solicitacao.nome}</h3>
                      <p className="text-sm text-gray-600">{solicitacao.endereco}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="aprovadas">
                <div className="space-y-4">
                  {solicitacoes.filter(s => s.status === "aprovado").map((solicitacao) => (
                    <div key={solicitacao.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium">{solicitacao.nome}</h3>
                      <p className="text-sm text-gray-600">{solicitacao.endereco}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
