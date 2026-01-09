const { Setor } = require("../models");

module.exports = {
  async listar(req, res) {
    try {
      const setores = await Setor.findAll({ order: [["nome", "ASC"]] });
      return res.json(setores);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao listar setores" });
    }
  },
};
