// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, senha });

      // ✅ salva token
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        localStorage.removeItem("token");
      }

      // ✅ salva user (id, nome, setor_id)
      if (response?.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        localStorage.removeItem("user");
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.erro ||
        err?.response?.data?.message ||
        "Erro ao fazer login";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sistema de Processo Digital</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {erro && <div className="login-error">{erro}</div>}
        </form>

        <div className="login-footer">
          © {new Date().getFullYear()} Processo Digital
        </div>
      </div>
    </div>
  );
}
