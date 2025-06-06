
import { User, Map, File, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-athis-500 to-urban-500 rounded-lg flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ATHIS Uberaba</h1>
                <p className="text-xs text-gray-500">Gestão Urbana Inteligente</p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 hover:bg-athis-50 transition-colors"
            >
              <Map className="w-4 h-4" />
              <span>Mapa</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/solicitacao")}
              className="flex items-center space-x-2 hover:bg-athis-50 transition-colors"
            >
              <File className="w-4 h-4" />
              <span>Solicitação</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="flex items-center space-x-2 hover:bg-athis-50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Painel</span>
            </Button>
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
