const { Setor } = require("../models");

module.exports = async (req, res, next) => {
  try {
    if (!req.setorId) {
      return res.status(403).json({ erro: "Acesso negado (sem setor)." });
    }

    const setor = await Setor.findByPk(req.setorId);
    if (!setor) {
      return res.status(403).json({ erro: "Setor do usuário não encontrado." });
    }

    const nome = String(setor.nome || "").trim().toLowerCase();

    // aceita "ti" ou nomes que contenham "ti"
    const ehTI = nome === "ti" || nome.includes("ti");

    if (!ehTI) {
      return res.status(403).json({ erro: "Acesso permitido apenas ao setor TI." });
    }

    return next();
  } catch (err) {
    console.error("onlyTI erro:", err);
    return res.status(500).json({ erro: "Erro ao validar permissão TI." });
  }
};
