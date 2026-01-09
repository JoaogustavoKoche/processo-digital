import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Processos from "./pages/Processos";
import ProcessoDetalhe from "./pages/ProcessoDetalhe";
import NovoProcesso from "./pages/NovoProcesso";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/processos" element={<Processos />} />

      {/* ⚠️ rota fixa vem ANTES */}
      <Route path="/processos/novo" element={<NovoProcesso />} />

      {/* rota dinâmica por último */}
      <Route path="/processos/:id" element={<ProcessoDetalhe />} />
    </Routes>
  );
}
