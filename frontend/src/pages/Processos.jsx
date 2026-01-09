import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Processos.css";

export default function Processos() {
  const [processos, setProcessos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const setorId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("setor_id"); // string ou null
  }, [location.search]);

  useEffect(() => {
    async function carregarProcessos() {
      setErro(null);
      setLoading(true);

      try {
        const url = setorId
          ? `/processos?setor_id=${encodeURIComponent(setorId)}`
          : "/processos";

        const res = await api.get(url);
        setProcessos(res.data);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar processos.");
      } finally {
        setLoading(false);
      }
    }

    carregarProcessos();
  }, [setorId]);

  const processosFiltrados = processos.filter((p) =>
    (p.titulo || "").toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="processos-container">
      <div className="processos-header">
        <div>
          <h1>Processos</h1>

          {setorId && (
            <p style={{ marginTop: 6, color: "#475569", fontSize: 13 }}>
              Mostrando apenas processos do setor <strong>{setorId}</strong>{" "}
              <button
                className="btn-link"
                style={{ marginLeft: 10 }}
                onClick={() => navigate("/processos")}
              >
                Ver todos
              </button>
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {setorId && (
            <button
              className="btn-primary"
              onClick={() => navigate("/processos")}
              title="Remove o filtro por setor"
            >
              Limpar filtro
            </button>
          )}

          <div className="processos-header-left">
          <button
            className="btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            ← Voltar ao Dashboard
          </button>

          
        </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/processos/novo")}
          >
            Novo Processo
          </button>
        </div>
      </div>

      <input
        className="processos-busca"
        type="text"
        placeholder="Buscar por título..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {erro && <p className="erro">{erro}</p>}

      {loading ? (
        <p style={{ padding: 12 }}>Carregando...</p>
      ) : (
        <table className="processos-tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Status</th>
              <th>Setor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {processosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.titulo}</td>
                <td>
                  <span className={`status ${p.status?.toLowerCase()}`}>
                    {p.status || "ABERTO"}
                  </span>
                </td>
                <td>{p.setor?.nome || "-"}</td>
                <td>
                  <button
                    className="btn-link"
                    onClick={() => navigate(`/processos/${p.id}`)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}

            {processosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="vazio">
                  Nenhum processo encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
