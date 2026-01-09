const { Processo, Setor, User } = require("../models");

module.exports = {
  async criar(req, res) {
    try {
      const { titulo, descricao, setor_id, usuario_id } = req.body;

      if (!titulo || !titulo.trim()) {
        return res.status(400).json({ erro: "Título é obrigatório." });
      }

      // Detecta se o model tem a coluna status (evita crash se model/banco estiverem divergentes)
      const attrs = (typeof Processo.getAttributes === "function")
        ? Processo.getAttributes()
        : (Processo.rawAttributes || {});
      const temStatus = !!attrs.status;

      const payload = {
        titulo: titulo.trim(),
        descricao: (descricao || "").trim(),
        setor_id: setor_id ? Number(setor_id) : null,
        usuario_id: usuario_id ? Number(usuario_id) : null,
      };

      if (temStatus) payload.status = "ABERTO";

      const novo = await Processo.create(payload);
      return res.status(201).json(novo);
    } catch (err) {
      console.error("Erro ao criar processo:", err);
      return res.status(500).json({
        erro: "Erro ao criar processo.",
        detalhe: err?.message || String(err),
      });
    }
  },

  async listar(req, res) {
    try {
      const { setor_id } = req.query;

      const where = {};
      if (setor_id) where.setor_id = Number(setor_id);

      const lista = await Processo.findAll({
        where,
        order: [["createdAt", "DESC"]],
        include: [
          { model: Setor, attributes: ["id", "nome"], required: false },
          { model: User, attributes: ["id", "nome"], required: false },
        ],
      });

      return res.json(lista);
    } catch (err) {
      console.error("ProcessoController.listar erro:", err);
      return res.status(500).json({ erro: "Erro ao listar processos." });
    }
  },

  async detalhe(req, res) {
    try {
      const { id } = req.params;

      const processo = await Processo.findByPk(id, {
        include: [
          { model: Setor, attributes: ["id", "nome"], required: false },
          { model: User, attributes: ["id", "nome"], required: false },
        ],
      });

      if (!processo) {
        return res.status(404).json({ erro: "Processo não encontrado." });
      }

      return res.json(processo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar processo." });
    }
  },
};
