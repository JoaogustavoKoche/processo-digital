// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [porSetor, setPorSetor] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function carregarDashboard() {
      try {
        const config = { timeout: 8000 };

        const [resumoRes, setorRes, movRes] = await Promise.all([
          api.get("/dashboard/resumo", config),
          api.get("/dashboard/setores", config),
          api.get("/dashboard/movimentacoes", config),
        ]);

        if (cancelado) return;

        setResumo(resumoRes.data);
        setPorSetor(setorRes.data);
        setMovimentacoes(movRes.data);
      } catch (err) {
        console.error("Erro dashboard:", err);

        if (err?.code === "ECONNABORTED") {
          setErro("Timeout: o backend não respondeu em 8s.");
          return;
        }

        const serverMsg =
          err?.response?.data?.erro || err?.response?.data?.message;

        setErro(serverMsg || "Erro ao conectar com o servidor backend.");
      }
    }

    carregarDashboard();

    return () => {
      cancelado = true;
    };
  }, []);

  if (erro) return <p className="state-error">{erro}</p>;
  if (!resumo) return <p className="state-text">Carregando...</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Visão geral dos processos, setores e movimentações recentes
          </p>
        </div>

        <div className="dashboard-actions">
          <button
            type="button"
            className="btn"
            onClick={() => window.location.reload()}
          >
            Atualizar
          </button>
          <button type="button" className="btn btn-primary">
            Novo Processo
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">Total de Processos</p>
          <p className="kpi-value">{resumo.total}</p>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">Abertos</p>
          <p className="kpi-value">{resumo.abertos}</p>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">Em Análise</p>
          <p className="kpi-value">{resumo.emAnalise}</p>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">Finalizados</p>
          <p className="kpi-value">{resumo.finalizados}</p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Processos por Setor</h2>
        <ul className="setor-list">
          {porSetor.map((s, idx) => (
            <li key={idx} className="setor-item">
              {s.setor} <span className="badge">{s.total}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">Últimas Movimentações</h2>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Processo</th>
                <th>Descrição</th>
                <th>Usuário</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((m) => (
                <tr key={m.id}>
                  <td>{m.processo?.titulo || "-"}</td>
                  <td>{m.descricao}</td>
                  <td>{m.usuario?.nome || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
