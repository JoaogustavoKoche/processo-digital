import { useEffect, useState } from "react";
import api from "../services/api";
import "./Anexos.css";

export default function Anexos({ processoId }) {
  const [anexos, setAnexos] = useState([]);
  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  async function carregarAnexos() {
    try {
      const res = await api.get(`/anexos/${processoId}`);
      setAnexos(res.data || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar anexos.");
    }
  }

  useEffect(() => {
    carregarAnexos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processoId]);

  async function enviar(e) {
    e.preventDefault();
    setErro(null);

    if (!arquivo) {
      setErro("Selecione um arquivo.");
      return;
    }

    setEnviando(true);

    try {
      const form = new FormData();
      form.append("arquivo", arquivo);
      if (user?.id) form.append("usuario_id", String(user.id));

      await api.post(`/anexos/${processoId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setArquivo(null);
      document.getElementById("input-anexo").value = "";

      await carregarAnexos();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.erro || "Erro ao enviar anexo.";
      setErro(msg);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <form className="anexos-form" onSubmit={enviar}>
        <input
          id="input-anexo"
          type="file"
          onChange={(e) => setArquivo(e.target.files?.[0] || null)}
        />

        <button className="anexos-btn" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {erro && <p className="anexos-erro">{erro}</p>}

      {anexos.length === 0 ? (
        <p className="anexos-vazio">Nenhum anexo enviado.</p>
      ) : (
        <ul className="anexos-lista">
          {anexos.map((a) => (
            <li key={a.id} className="anexos-item">
              <div>
                <strong>{a.nome_original}</strong>
                <div className="anexos-meta">
                  {a.mime_type} • {(a.tamanho / 1024).toFixed(1)} KB
                </div>
              </div>

              <a
                className="anexos-link"
                href={`http://localhost:3333${a.url}`}
                target="_blank"
                rel="noreferrer"
              >
                Abrir
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
