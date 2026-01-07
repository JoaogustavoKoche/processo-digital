const { Movimentacao, Processo, User } = require('../models');

module.exports = {
  async criar(req, res) {
    const { processo_id, descricao } = req.body;

    const processo = await Processo.findOne({
      where: {
        id: processo_id,
        setor_id: req.setorId,
      },
    });

    if (!processo) {
      return res.status(403).json({ erro: 'Acesso negado ao processo' });
    }

    const movimentacao = await Movimentacao.create({
      descricao,
      processo_id,
      usuario_id: req.userId,
    });

    return res.status(201).json(movimentacao);
  },

  async listar(req, res) {
    const { processo_id } = req.params;

    const timeline = await Movimentacao.findAll({
      where: { processo_id },
      include: [
        {
          model: User,
          attributes: ['nome'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    return res.json(timeline);
  },
};
