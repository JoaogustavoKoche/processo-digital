import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Instância central do Axios
const api = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 5000,
});

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [porSetor, setPorSetor] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Usuário não autenticado. Faça login novamente.");
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    async function carregarDashboard() {
      try {
        const [resumoRes, setorRes, movRes] = await Promise.all([
          api.get("/dashboard/resumo"),
          api.get("/dashboard/setores"),
          api.get("/dashboard/movimentacoes"),
        ]);

        setResumo(resumoRes.data);
        setPorSetor(setorRes.data);
        setMovimentacoes(movRes.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setErro(
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3333."
        );
      }
    }

    carregarDashboard();
  }, []);

  if (erro) return <p className="p-6 text-red-600">{erro}</p>;

  if (!resumo) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm">Total de Processos</p>
            <p className="text-2xl font-bold">{resumo.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm">Abertos</p>
            <p className="text-2xl font-bold">{resumo.abertos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm">Em Análise</p>
            <p className="text-2xl font-bold">{resumo.emAnalise}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm">Finalizados</p>
            <p className="text-2xl font-bold">{resumo.finalizados}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="font-semibold mb-4">Processos por Setor</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={porSetor}>
            <XAxis dataKey="setor" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-4">Últimas Movimentações</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Processo</th>
              <th>Descrição</th>
              <th>Usuário</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="py-2">{m.processo?.titulo || "-"}</td>
                <td>{m.descricao}</td>
                <td>{m.usuario?.nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
