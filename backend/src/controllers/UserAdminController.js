const { User, Setor } = require("../models");

module.exports = {
  async criar(req, res) {
    try {
      const { nome, email, senha, setor_id } = req.body;

      if (!nome || !email || !senha || !setor_id) {
        return res.status(400).json({ erro: "Preencha nome, email, senha e setor." });
      }

      const existe = await User.findOne({ where: { email } });
      if (existe) {
        return res.status(400).json({ erro: "E-mail já cadastrado." });
      }

      const setor = await Setor.findByPk(Number(setor_id));
      if (!setor) {
        return res.status(400).json({ erro: "Setor inválido." });
      }

      const novo = await User.create({
        nome,
        email,
        senha, // sem hash
        setor_id: Number(setor_id),
      });

      return res.status(201).json({
        id: novo.id,
        nome: novo.nome,
        email: novo.email,
        setor_id: novo.setor_id,
      });
    } catch (err) {
      console.error("UserAdminController.criar:", err);
      return res.status(500).json({ erro: "Erro ao cadastrar usuário." });
    }
  },

  async listar(req, res) {
    try {
      const lista = await User.findAll({
        attributes: ["id", "nome", "email", "setor_id", "createdAt"],
        order: [["createdAt", "DESC"]],
      });

      return res.json(lista);
    } catch (err) {
      console.error("UserAdminController.listar:", err);
      return res.status(500).json({ erro: "Erro ao listar usuários." });
    }
  },
};
