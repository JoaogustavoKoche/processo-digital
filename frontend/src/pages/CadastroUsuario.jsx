// frontend/src/pages/CadastroUsuario.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CadastroUsuario.css";

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [setorId, setSetorId] = useState("");

  const [setores, setSetores] = useState([]);
  const [erro, setErro] = useState(null);
  const [ok, setOk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const token = useMemo(() => localStorage.getItem("token") || null, []);

  useEffect(() => {
    async function carregar() {
      setErro(null);
      setLoading(true);

      // Se não tem token, volta pro login
      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        // carrega setores para o select
        const res = await api.get("/setores");
        const lista = res.data || [];
        setSetores(lista);

        // pré-seleciona o setor do usuário (opcional)
        if (!setorId && user?.setor_id) {
          setSetorId(String(user.setor_id));
        }
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar setores.");
      } finally {
        setLoading(false);
      }
    }

    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, token]);

  async function cadastrar(e) {
    e.preventDefault();
    setErro(null);
    setOk(null);
    setSubmitting(true);

    try {
      if (!token) {
        setErro("Token não encontrado. Faça login novamente.");
        navigate("/", { replace: true });
        return;
      }

      await api.post(
        "/users",
        {
          nome,
          email,
          senha,
          setor_id: Number(setorId),
        },
        {
          // força o header para não depender do interceptor
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOk("Usuário cadastrado com sucesso.");
      setNome("");
      setEmail("");
      setSenha("");
      setSetorId("");

      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;

      const msg =
        err?.response?.data?.erro ||
        err?.response?.data?.message ||
        "Erro ao cadastrar usuário.";

      // se for 401/403, provavelmente não é TI ou token inválido
      if (status === 401 || status === 403) {
        setErro(msg || "Sem permissão para cadastrar usuário.");
        // se token inválido, limpa e volta ao login
        if (status === 401) {
          
          setTimeout(() => navigate("/", { replace: true }), 1200);
        }
      } else {
        setErro(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="cu-wrap">Carregando...</p>;

  return (
    <div className="cu-wrap">
      <div className="cu-top">
        <button className="cu-btn" onClick={() => navigate("/dashboard")}>
          ← Voltar
        </button>
        <h1>Cadastro de Usuário</h1>
      </div>

      <form className="cu-form" onSubmit={cadastrar}>
        {erro && <p className="cu-erro">{erro}</p>}
        {ok && <p className="cu-ok">{ok}</p>}

        <label>
          Nome
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Nome completo"
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@exemplo.com"
          />
        </label>

        <label>
          Senha
          <input
            type="text"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            placeholder="Defina uma senha"
          />
        </label>

        <label>
          Setor
          <select
            value={setorId}
            onChange={(e) => setSetorId(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {setores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome} (ID {s.id})
              </option>
            ))}
          </select>
        </label>

        <div className="cu-actions">
          <button
            type="button"
            className="cu-btn"
            onClick={() => navigate("/dashboard")}
            disabled={submitting}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="cu-btn cu-btn-primary"
            disabled={submitting}
          >
            {submitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>

        <p className="cu-muted">
          Observação: apenas usuários do setor <strong>TI</strong> conseguem usar
          esta tela (o backend bloqueia).
        </p>
      </form>
    </div>
  );
}
