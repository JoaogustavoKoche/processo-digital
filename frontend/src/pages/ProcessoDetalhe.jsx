import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./ProcessoDetalhe.css";

export default function ProcessoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [processo, setProcesso] = useState(null);
  const [movs, setMovs] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setErro(null);
    setLoading(true);

    try {
      const [pRes, mRes] = await Promise.all([
        api.get(`/processos/${id}`, { timeout: 8000 }),
        api.get(`/movimentacoes/${id}`, { timeout: 8000 }),
      ]);

      setProcesso(pRes.data);
      setMovs(mRes.data);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.erro || "Erro ao carregar processo.";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function adicionarMovimentacao(e) {
    e.preventDefault();
    if (!descricao.trim()) return;

    setSalvando(true);
    setErro(null);

    try {
      await api.post(
        "/movimentacoes",
        { processo_id: Number(id), descricao },
        { timeout: 8000 }
      );

      setDescricao("");
      await carregar();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.erro || "Erro ao adicionar movimentação.";
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  if (loading) return <p className="pd-state">Carregando...</p>;
  if (erro) return <p className="pd-state pd-error">{erro}</p>;
  if (!processo) return <p className="pd-state">Processo não encontrado.</p>;

  return (
    <div className="pd-container">
      <div className="pd-top">
        <button className="pd-btn" onClick={() => navigate("/processos")}>
          Voltar
        </button>

        <button className="pd-btn" onClick={carregar}>
          Atualizar
        </button>
      </div>

      <div className="pd-card">
        <div className="pd-title-row">
          <h1 className="pd-title">
            #{processo.id} — {processo.titulo}
          </h1>

          <span className={`pd-status ${String(processo.status || "ABERTO").toLowerCase()}`}>
            {processo.status || "ABERTO"}
          </span>
        </div>

        <p className="pd-desc">{processo.descricao || "-"}</p>

        <div className="pd-meta">
          <div>
            <span className="pd-meta-label">Setor</span>
            <span className="pd-meta-value">
              {processo.setor?.nome || processo.setor_id || "-"}
            </span>
          </div>

          <div>
            <span className="pd-meta-label">Criado por</span>
            <span className="pd-meta-value">
              {processo.user?.nome || processo.criado_por || "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="pd-grid">
        <div className="pd-card">
          <h2 className="pd-section-title">Linha do tempo</h2>

          {movs.length === 0 ? (
            <p className="pd-empty">Nenhuma movimentação ainda.</p>
          ) : (
            <ul className="pd-timeline">
              {movs.map((m) => (
                <li key={m.id} className="pd-timeline-item">
                  <div className="pd-dot" />
                  <div className="pd-timeline-content">
                    <p className="pd-mov-desc">{m.descricao}</p>
                    <p className="pd-mov-meta">
                      {m.usuario || m.usuario?.nome || "-"}{" "}
                      <span className="pd-sep">•</span>{" "}
                      {m.criado_em
                        ? new Date(m.criado_em).toLocaleString()
                        : m.createdAt
                        ? new Date(m.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pd-card">
          <h2 className="pd-section-title">Adicionar movimentação</h2>

          <form onSubmit={adicionarMovimentacao} className="pd-form">
            <textarea
              className="pd-textarea"
              placeholder="Descreva a movimentação (ex: Recebido, encaminhado, solicitado documento...)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={6}
            />

            <button className="pd-btn pd-btn-primary" disabled={salvando}>
              {salvando ? "Salvando..." : "Registrar"}
            </button>
          </form>

          <p className="pd-hint">
            Dica: cada registro aqui vira um item na linha do tempo do processo.
          </p>
        </div>
      </div>
    </div>
  );
}
