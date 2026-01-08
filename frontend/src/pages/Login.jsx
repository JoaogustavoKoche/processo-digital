import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      await api.post("/auth/login", { email, senha });
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.erro ||
        err?.response?.data?.message ||
        "Erro ao fazer login";
      setErro(msg);
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
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>

          {erro && <div className="login-error">{erro}</div>}
        </form>

        <div className="login-footer">
          © {new Date().getFullYear()} Processo Digital
        </div>
      </div>
    </div>
  );
}
