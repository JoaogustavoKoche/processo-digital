import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Processos from "./pages/Processos";
import ProcessoDetalhe from "./pages/ProcessoDetalhe";
import NovoProcesso from "./pages/NovoProcesso";
import CadastroUsuario from "./pages/CadastroUsuario";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/processos" element={<Processos />} />
      <Route path="/processos/novo" element={<NovoProcesso />} />
      <Route path="/processos/:id" element={<ProcessoDetalhe />} />
      <Route path="/usuarios/novo" element={<CadastroUsuario />} />
    </Routes>
  );
}
