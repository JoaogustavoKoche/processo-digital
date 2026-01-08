const { Movimentacao, Processo, User } = require("../models");

module.exports = {
  async criar(req, res) {
    try {
      const { processo_id, descricao, usuario_id } = req.body;

      const mov = await Movimentacao.create({
        processo_id,
        descricao,
        usuario_id: usuario_id || null,
      });

      return res.status(201).json(mov);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao criar movimentação." });
    }
  },

  async listar(req, res) {
    try {
      const { processo_id } = req.params;

      const lista = await Movimentacao.findAll({
        where: { processo_id },
        order: [["createdAt", "ASC"]],
        include: [
          { model: Processo, attributes: ["id", "titulo"], required: false },
          { model: User, attributes: ["id", "nome"], required: false },
        ],
      });

      return res.json(lista);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao listar movimentações." });
    }
  },
};
