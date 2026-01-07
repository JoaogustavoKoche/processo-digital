const { Processo, User } = require('../models');

module.exports = {
  async criar(req, res) {
    const { titulo, descricao } = req.body;

    const processo = await Processo.create({
      titulo,
      descricao,
      status: 'ABERTO',
      usuario_id: req.userId,
      setor_id: req.setorId,
    });

    return res.status(201).json(processo);
  },

  async listar(req, res) {
    const processos = await Processo.findAll({
      where: { setor_id: req.setorId },
      include: [
        {
          model: User,
          attributes: ['nome'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json(processos);
  },
};
