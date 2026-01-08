const { Processo, Setor, User } = require("../models");

module.exports = {
  async criar(req, res) {
    try {
      const { titulo, descricao, setor_id } = req.body;

      const novo = await Processo.create({
        titulo,
        descricao,
        setor_id: setor_id || null,
        status: "ABERTO",
      });

      return res.status(201).json(novo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao criar processo." });
    }
  },

  async listar(req, res) {
    try {
      const lista = await Processo.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          { model: Setor, attributes: ["id", "nome"], required: false },
          { model: User, attributes: ["id", "nome"], required: false },
        ],
      });

      return res.json(lista);
    } catch (err) {
      console.error(err);
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
