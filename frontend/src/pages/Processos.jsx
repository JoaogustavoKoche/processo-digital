import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Processos.css";

export default function Processos() {
  const [processos, setProcessos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarProcessos() {
      try {
        const res = await api.get("/processos");
        setProcessos(res.data);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar processos.");
      }
    }

    carregarProcessos();
  }, []);

  const processosFiltrados = processos.filter((p) =>
    p.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="processos-container">
      <div className="processos-header">
        <h1>Processos</h1>

        <button
          className="btn-primary"
          onClick={() => navigate("/processos/novo")}
        >
          Novo Processo
        </button>
      </div>

      <input
        className="processos-busca"
        type="text"
        placeholder="Buscar por título..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {erro && <p className="erro">{erro}</p>}

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
    </div>
  );
}
