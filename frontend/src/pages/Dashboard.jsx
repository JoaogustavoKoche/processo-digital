// frontend/src/pages/Dashboard.jsx
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
  const [isTI, setIsTI] = useState(false);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setErro(null);

        // pega usuário logado do localStorage (salvo no login)
        let user = null;
        try {
          user = JSON.parse(localStorage.getItem("user") || "null");
        } catch {
          user = null;
        }

        // descobre se o setor do usuário é TI (buscando o nome do setor no backend)
        try {
          const resSetores = await api.get("/setores");
          const setorUser = (resSetores.data || []).find(
            (s) => Number(s.id) === Number(user?.setor_id)
          );
          const nomeSetor = String(setorUser?.nome || "").trim().toLowerCase();
          setIsTI(nomeSetor === "ti");
        } catch (e) {
          console.error("Falha ao verificar setor TI:", e);
          setIsTI(false);
        }

        // carrega dados do dashboard
        const [resumoRes, setorRes, movRes] = await Promise.all([
          api.get("/dashboard/resumo"),
          api.get("/dashboard/setores"),
          api.get("/dashboard/movimentacoes"),
        ]);

        setResumo(resumoRes.data);
        setPorSetor(setorRes.data || []);
        setMovimentacoes(movRes.data || []);
      } catch (err) {
        console.error("Erro dashboard:", err);

        const msg =
          err?.response?.data?.erro ||
          err?.response?.data?.message ||
          "Erro ao conectar com o backend.";

        setErro(msg);
      }
    }

    carregarDashboard();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }



  if (erro) return <p className="dash-erro">{erro}</p>;
  if (!resumo) return <p className="dash-loading">Carregando...</p>;

  return (
    <div className="dash-wrap">
      <div className="dash-top">
        <h1 className="dash-title">Dashboard</h1>

        <div className="dash-actions">
          <button className="dash-btn" onClick={() => navigate("/processos")}>
            Ver Processos do meu setor
          </button>

          {isTI && (
            <button
              className="dash-btn dash-btn-primary"
              onClick={() => navigate("/usuarios/novo")}
            >
              Cadastrar Usuário
            </button>
          )}


          <button className="dash-btn" onClick={logout}>
            Sair
          </button>

        </div>


        
      </div>

      <div className="dash-grid">
        <Card>
          <CardContent className="dash-card">
            <p className="dash-label">Total de Processos</p>
            <p className="dash-value">{resumo.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="dash-card">
            <p className="dash-label">Abertos</p>
            <p className="dash-value">{resumo.abertos}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="dash-card">
            <p className="dash-label">Em Análise</p>
            <p className="dash-value">{resumo.emAnalise}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="dash-card">
            <p className="dash-label">Finalizados</p>
            <p className="dash-value">{resumo.finalizados}</p>
          </CardContent>
        </Card>
      </div>

      <div className="dash-block">
        <h2 className="dash-subtitle">Processos por Setor</h2>

        {porSetor.length === 0 ? (
          <p className="dash-muted">Sem dados.</p>
        ) : (
          <ul className="dash-list">
            {porSetor.map((s, idx) => (
              <li key={idx} className="dash-item">
                <span>{s.setor}</span>
                <strong>{s.total}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dash-block">
        <h2 className="dash-subtitle">Últimas Movimentações</h2>

        {movimentacoes.length === 0 ? (
          <p className="dash-muted">Sem movimentações.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
