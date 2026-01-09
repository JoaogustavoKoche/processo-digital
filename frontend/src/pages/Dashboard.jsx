import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent } from "../components/Card";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState(null);
  const [porSetor, setPorSetor] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [erro, setErro] = useState(null);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const setorIdUsuario = user?.setor_id ? String(user.setor_id) : "";

  useEffect(() => {
    async function carregar() {
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
        console.error(err);
        setErro("Erro ao conectar com o backend.");
      }
    }

    carregar();
  }, []);

  function irParaMeusProcessos() {
    if (!setorIdUsuario) {
      alert("Usuário sem setor definido. Verifique o user.setor_id no localStorage.");
      return;
    }
    navigate(`/processos?setor_id=${encodeURIComponent(setorIdUsuario)}`);
  }

  if (erro) return <p className="p-6 dash-error">{erro}</p>;
  if (!resumo) return <p className="p-6">Carregando...</p>;

  return (
    <div className="dash-container">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">
            {user?.nome ? `Usuário: ${user.nome}` : "Usuário não identificado"}{" "}
            {setorIdUsuario ? `| Setor ID: ${setorIdUsuario}` : ""}
          </p>
        </div>

        <div className="dash-actions">
          <button className="dash-btn dash-btn-primary" onClick={irParaMeusProcessos}>
            Meus processos (meu setor)
          </button>

          <button className="dash-btn" onClick={() => navigate("/processos")}>
            Ver todos os processos
          </button>
        </div>
      </div>

      <div className="dash-cards">
        <Card>
          <CardContent className="dash-card">
            <p className="dash-label">Total de Processos</p>
            <strong className="dash-value">{resumo.total}</strong>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="dash-card">
            <p className="dash-label">Abertos</p>
            <strong className="dash-value">{resumo.abertos}</strong>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="dash-card">
            <p className="dash-label">Em Análise</p>
            <strong className="dash-value">{resumo.emAnalise}</strong>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="dash-card">
            <p className="dash-label">Finalizados</p>
            <strong className="dash-value">{resumo.finalizados}</strong>
          </CardContent>
        </Card>
      </div>

      <div className="dash-grid">
        <Card className="dash-panel">
          <h2 className="dash-panel-title">Processos por Setor</h2>
          <ul className="dash-list">
            {porSetor.map((s, idx) => (
              <li key={idx}>
                <strong>{s.setor}</strong>: {s.total}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="dash-panel">
          <h2 className="dash-panel-title">Últimas Movimentações</h2>
          <div className="dash-table-wrap">
            <table className="dash-table">
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
        </Card>
      </div>
    </div>
  );
}
