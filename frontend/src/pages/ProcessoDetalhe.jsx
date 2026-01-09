// frontend/src/pages/ProcessoDetalhe.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./ProcessoDetalhe.css";

export default function ProcessoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [processo, setProcesso] = useState(null);
  const [movs, setMovs] = useState([]);
  const [setores, setSetores] = useState([]);

  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  // tramitação
  const [setorDestinoId, setSetorDestinoId] = useState("");
  const [descTramitacao, setDescTramitacao] = useState("");
  const [submittingTramite, setSubmittingTramite] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const podeTramitar = useMemo(() => {
    return Number(processo?.setor_id) === Number(user?.setor_id);
  }, [processo, user]);

  useEffect(() => {
    async function carregar() {
      setErro(null);
      setLoading(true);

      try {
        const [procRes, movRes, setoresRes] = await Promise.all([
          api.get(`/processos/${id}`),
          api.get(`/movimentacoes/${id}`),
          api.get(`/setores`),
        ]);

        setProcesso(procRes.data);
        setMovs(movRes.data || []);
        setSetores(setoresRes.data || []);
      } catch (err) {
        console.error(err);
        const msg =
          err?.response?.data?.erro ||
          err?.response?.data?.message ||
          "Erro ao carregar processo.";
        setErro(msg);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id]);

  async function tramitar() {
    setErro(null);

    if (!setorDestinoId) {
      setErro("Selecione o setor de destino.");
      return;
    }

    // trava UX: só mostra botão quando pode, mas aqui garante também
    if (!podeTramitar) {
      setErro("Você não pode tramitar este processo (setor diferente).");
      return;
    }

    setSubmittingTramite(true);
    try {
      await api.patch(`/tramitacoes/${id}`, {
        setor_destino_id: Number(setorDestinoId),
        descricao: descTramitacao,
      });

      // recarrega tudo para refletir setor novo + linha do tempo
      const [procRes, movRes] = await Promise.all([
        api.get(`/processos/${id}`),
        api.get(`/movimentacoes/${id}`),
      ]);

      setProcesso(procRes.data);
      setMovs(movRes.data || []);

      setSetorDestinoId("");
      setDescTramitacao("");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.erro ||
        err?.response?.data?.message ||
        "Erro ao tramitar processo.";
      setErro(msg);
    } finally {
      setSubmittingTramite(false);
    }
  }

  if (loading) return <p className="pd-wrap">Carregando...</p>;
  if (erro) return <p className="pd-wrap pd-erro">{erro}</p>;
  if (!processo) return <p className="pd-wrap">Processo não encontrado.</p>;

  return (
    <div className="pd-wrap">
      <div className="pd-top">
        <button className="pd-btn" onClick={() => navigate("/processos")}>
          ← Voltar
        </button>
        <h1 className="pd-title">Processo #{processo.id}</h1>
      </div>

      <div className="pd-card">
        <h2 className="pd-subtitle">{processo.titulo}</h2>
        <p className="pd-desc">{processo.descricao}</p>

        <div className="pd-meta">
          <span>
            <strong>Status:</strong> {processo.status || "ABERTO"}
          </span>
          <span>
            <strong>Setor:</strong> {processo.setor?.nome || "-"} (ID{" "}
            {processo.setor_id})
          </span>
          <span>
            <strong>Criado por:</strong> {processo.User?.nome || processo.user?.nome || "-"}
          </span>
        </div>
      </div>

      {/* TRAMITAÇÃO */}
      <div className="pd-card">
        <div className="pd-section-head">
          <h2 className="pd-subtitle">Tramitação</h2>

          {!podeTramitar && (
            <span className="pd-badge">
              Você só pode tramitar processos do seu setor
            </span>
          )}
        </div>

        {podeTramitar ? (
          <>
            <label className="pd-label">
              Setor de destino
              <select
                className="pd-select"
                value={setorDestinoId}
                onChange={(e) => setSetorDestinoId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {setores
                  .filter((s) => Number(s.id) !== Number(processo.setor_id))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome} (ID {s.id})
                    </option>
                  ))}
              </select>
            </label>

            <label className="pd-label">
              Observação (opcional)
              <input
                className="pd-input"
                value={descTramitacao}
                onChange={(e) => setDescTramitacao(e.target.value)}
                placeholder="Ex: Encaminhado para análise técnica..."
              />
            </label>

            <button
              className="pd-btn pd-btn-primary"
              onClick={tramitar}
              disabled={submittingTramite}
            >
              {submittingTramite ? "Tramitando..." : "Tramitar"}
            </button>
          </>
        ) : (
          <p className="pd-muted">
            Este processo não está no seu setor. Para tramitar, o processo deve
            estar com o seu setor no momento.
          </p>
        )}
      </div>

      {/* LINHA DO TEMPO */}
      <div className="pd-card">
        <h2 className="pd-subtitle">Linha do tempo</h2>

        {movs.length === 0 ? (
          <p className="pd-muted">Nenhuma movimentação registrada.</p>
        ) : (
          <ul className="pd-timeline">
            {movs.map((m) => (
              <li key={m.id} className="pd-timeline-item">
                <div className="pd-timeline-top">
                  <strong>{m.usuario?.nome || m.user?.nome || m.usuario || "-"}</strong>
                  <span className="pd-date">
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className="pd-timeline-desc">{m.descricao}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
