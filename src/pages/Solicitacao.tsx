
import { useState } from "react";
import { MapIcon, User, File } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Solicitacao = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    endereco: "",
    telefone: "",
    email: "",
    rendaFamiliar: "",
    numeroFamiliares: "",
    descricaoSituacao: ""
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Solicitação enviada com sucesso!",
      description: "Sua solicitação foi registrada e será analisada pela equipe técnica.",
    });
    
    // Reset form
    setFormData({
      nome: "",
      cpf: "",
      endereco: "",
      telefone: "",
      email: "",
      rendaFamiliar: "",
      numeroFamiliares: "",
      descricaoSituacao: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-athis-500 to-urban-500 rounded-lg flex items-center justify-center">
              <File className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Solicitação ATHIS</h1>
              <p className="text-gray-600">Assistência Técnica para Habitação de Interesse Social</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-athis-600" />
                  <span>Dados do Solicitante</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Digite seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Rua, número, bairro, CEP"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(34) 99999-9999"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rendaFamiliar">Renda Familiar (R$)</Label>
                      <Input
                        id="rendaFamiliar"
                        name="rendaFamiliar"
                        value={formData.rendaFamiliar}
                        onChange={handleChange}
                        placeholder="0,00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="numeroFamiliares">Número de Familiares</Label>
                      <Input
                        id="numeroFamiliares"
                        name="numeroFamiliares"
                        type="number"
                        value={formData.numeroFamiliares}
                        onChange={handleChange}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descricaoSituacao">Descrição da Situação Habitacional</Label>
                    <Textarea
                      id="descricaoSituacao"
                      name="descricaoSituacao"
                      value={formData.descricaoSituacao}
                      onChange={handleChange}
                      placeholder="Descreva sua situação atual de moradia e necessidades específicas..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-athis-500 to-urban-500 hover:from-athis-600 hover:to-urban-600 text-white"
                  >
                    Enviar Solicitação
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informações Laterais */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">O que é ATHIS?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  A Assistência Técnica para Habitação de Interesse Social oferece apoio técnico 
                  gratuito para famílias de baixa renda.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Serviços inclusos:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Elaboração de projetos arquitetônicos</li>
                    <li>• Acompanhamento de obras</li>
                    <li>• Orientação técnica especializada</li>
                    <li>• Regularização fundiária</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Critérios de Elegibilidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Renda familiar até 3 salários mínimos</li>
                    <li>• Residir no município de Uberaba</li>
                    <li>• Não possuir outro imóvel</li>
                    <li>• Estar em situação de vulnerabilidade habitacional</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-athis-50 to-urban-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapIcon className="w-4 h-4 text-athis-600" />
                  <span className="text-sm font-medium">Dúvidas?</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Entre em contato com nossa equipe para esclarecimentos.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Falar com Atendimento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Solicitacao;
