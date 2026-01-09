import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./NovoProcesso.css";

export default function NovoProcesso() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [setores, setSetores] = useState([]);
  const [setorId, setSetorId] = useState("");
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // pega usuário do localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  // prioridade do setor:
  // 1) querystring ?setor_id=
  // 2) localStorage user.setor_id
  // 3) seleção manual
  useEffect(() => {
    const setorQuery = params.get("setor_id");
    if (setorQuery) {
      setSetorId(String(setorQuery));
      return;
    }
    if (user?.setor_id) {
      setSetorId(String(user.setor_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // carrega setores (para mostrar nome e permitir trocar se quiser)
  useEffect(() => {
    async function carregarSetores() {
      try {
        const res = await api.get("/setores");
        setSetores(res.data);
      } catch (err) {
        console.error(err);
        // não bloqueia a criação se setores falhar, só não mostra lista
      }
    }

    carregarSetores();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    if (!titulo.trim()) {
      setErro("Informe o título.");
      return;
    }

    setSalvando(true);

    try {
      const payload = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        setor_id: setorId ? Number(setorId) : null,
        usuario_id: user?.id ? Number(user.id) : null,
        };


      const res = await api.post("/processos", payload, { timeout: 8000 });

      // vai para detalhe do processo criado
      navigate(`/processos/${res.data.id}`);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.erro ||
        err?.response?.data?.message ||
        "Erro ao criar processo.";
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  const nomeSetorAtual =
    setores.find((s) => String(s.id) === String(setorId))?.nome || "";

  return (
    <div className="novo-container">
      <div className="novo-header">
        <button className="btn-secondary" onClick={() => navigate("/processos")}>
          ← Voltar
        </button>
        <h1>Novo Processo</h1>
      </div>

      <form className="novo-form" onSubmit={handleSubmit}>
        {erro && <p className="erro">{erro}</p>}

        <div className="campo">
          <label>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Pedido de Licença"
            required
          />
        </div>

        <div className="campo">
          <label>Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o pedido, contexto e detalhes..."
            rows={6}
          />
        </div>

        <div className="campo">
          <label>Setor</label>

          {setores.length > 0 ? (
            <>
              <select
                value={setorId}
                onChange={(e) => setSetorId(e.target.value)}
              >
                <option value="">Selecione um setor</option>
                {setores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>

              {setorId && nomeSetorAtual && (
                <small className="hint">
                  Setor selecionado: <strong>{nomeSetorAtual}</strong>
                </small>
              )}
            </>
          ) : (
            <small className="hint">
              Não foi possível carregar setores. Você ainda pode criar (setor pode ficar vazio).
            </small>
          )}
        </div>

        <div className="novo-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/processos")}
          >
            Cancelar
          </button>

          <button className="btn-primary" disabled={salvando}>
            {salvando ? "Criando..." : "Criar Processo"}
          </button>
        </div>
      </form>
    </div>
  );
}
