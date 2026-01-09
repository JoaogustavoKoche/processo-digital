import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./ProcessoDetalhe.css";
import Anexos from "../components/Anexos";


export default function ProcessoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [processo, setProcesso] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [setores, setSetores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [setorDestinoId, setSetorDestinoId] = useState("");
  const [descricaoTramitacao, setDescricaoTramitacao] = useState("");
  const [tramitando, setTramitando] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  async function carregar() {
    setErro(null);
    setLoading(true);

    try {
      const [procRes, movRes, setRes] = await Promise.all([
        api.get(`/processos/${id}`),
        api.get(`/movimentacoes/${id}`),
        api.get(`/setores`),
      ]);

      setProcesso(procRes.data);
      setMovimentacoes(movRes.data || []);
      setSetores(setRes.data || []);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.erro ||
        err?.response?.data?.message ||
        "Erro ao carregar dados do processo.";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function tramitarProcesso() {
    setErro(null);

    if (!setorDestinoId) {
      setErro("Selecione um setor destino.");
      return;
    }

    setTramitando(true);

    try {
      await api.put(`/tramitacoes/processos/${id}/tramitar`, {
        setor_destino_id: Number(setorDestinoId),
        usuario_id: user?.id ? Number(user.id) : null,
        descricao: descricaoTramitacao,
      });

      setSetorDestinoId("");
      setDescricaoTramitacao("");

      await carregar();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.erro ||
        err?.response?.data?.message ||
        "Erro ao tramitar processo.";
      setErro(msg);
    } finally {
      setTramitando(false);
    }
  }

  const setorAtualNome =
    processo?.setor?.nome ||
    setores.find((s) => String(s.id) === String(processo?.setor_id))?.nome ||
    "-";

  const statusLabel = (processo?.status || "ABERTO").toUpperCase();

  if (loading) return <p className="pd-loading">Carregando...</p>;

  if (erro)
    return (
      <div className="pd-wrap">
        <div className="pd-top">
          <button className="pd-btn" onClick={() => navigate("/processos")}>
            ← Voltar
          </button>
          <button className="pd-btn" onClick={carregar}>
            Atualizar
          </button>
        </div>

        <p className="pd-erro">{erro}</p>
      </div>
    );

  if (!processo)
    return (
      <div className="pd-wrap">
        <div className="pd-top">
          <button className="pd-btn" onClick={() => navigate("/processos")}>
            ← Voltar
          </button>
        </div>
        <p className="pd-erro">Processo não encontrado.</p>
      </div>
    );

  return (
    <div className="pd-wrap">
      <div className="pd-top">
        <button className="pd-btn" onClick={() => navigate("/processos")}>
          ← Voltar
        </button>

        <div className="pd-actions">
          {processo?.setor_id && (
            <button
              className="pd-btn"
              onClick={() =>
                navigate(`/processos?setor_id=${encodeURIComponent(processo.setor_id)}`)
              }
              title="Ver lista filtrada por setor"
            >
              Ver setor atual
            </button>
          )}

          <button className="pd-btn" onClick={carregar}>
            Atualizar
          </button>
        </div>
      </div>

      <div className="pd-card">
        <div className="pd-title-row">
          <h1 className="pd-title">
            #{processo.id} — {processo.titulo}
          </h1>

          <span className={`pd-status ${statusLabel.toLowerCase()}`}>
            {statusLabel}
          </span>
        </div>

        <div className="pd-meta">
          <div>
            <span className="pd-meta-label">Setor atual:</span>{" "}
            <strong>{setorAtualNome}</strong> (ID {processo.setor_id || "-"})
          </div>

          <div>
            <span className="pd-meta-label">Criado por:</span>{" "}
            <strong>{processo.User?.nome || processo.user?.nome || "-"}</strong>
          </div>
        </div>

        <div className="pd-desc">
          <h2 className="pd-subtitle">Descrição</h2>
          <p>{processo.descricao || "-"}</p>
        </div>
      </div>

      {/* TRAMITAÇÃO */}
      <div className="pd-card">
        <h2 className="pd-subtitle">Tramitação</h2>

        <div className="pd-row">
          <select
            className="pd-select"
            value={setorDestinoId}
            onChange={(e) => setSetorDestinoId(e.target.value)}
          >
            <option value="">Selecione o setor destino</option>
            {setores
              .filter((s) => String(s.id) !== String(processo.setor_id))
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
          </select>

          <button
            className="pd-btn pd-btn-primary"
            onClick={tramitarProcesso}
            disabled={!setorDestinoId || tramitando}
          >
            {tramitando ? "Tramitando..." : "Tramitar"}
          </button>
        </div>

        <textarea
          className="pd-textarea"
          value={descricaoTramitacao}
          onChange={(e) => setDescricaoTramitacao(e.target.value)}
          placeholder="Descrição (opcional): motivo, observação, encaminhamento..."
          rows={3}
        />
      </div>

          {/* ANEXOS */}
    <div className="pd-card">
      <h2 className="pd-subtitle">Anexos</h2>

      <Anexos processoId={processo.id} />
    </div>


      {/* LINHA DO TEMPO */}
      <div className="pd-card">
        <h2 className="pd-subtitle">Linha do tempo</h2>

        {movimentacoes.length === 0 ? (
          <p className="pd-muted">Sem movimentações ainda.</p>
        ) : (
          <ul className="pd-timeline">
            {movimentacoes.map((m) => (
              <li key={m.id} className="pd-timeline-item">
                <div className="pd-dot" />
                <div className="pd-timeline-content">
                  <div className="pd-timeline-top">
                    <strong>{m.usuario?.nome || m.usuario || "-"}</strong>
                    <span className="pd-time">
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleString()
                        : m.criado_em
                        ? new Date(m.criado_em).toLocaleString()
                        : ""}
                    </span>
                  </div>
                  <div className="pd-timeline-desc">{m.descricao}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
