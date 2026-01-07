const { Processo, Setor, ProcessoMovimentacao, User } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  async resumo(req, res) {
    const total = await Processo.count();
    const abertos = await Processo.count({ where: { status: 'ABERTO' } });
    const emAnalise = await Processo.count({ where: { status: 'ANALISE' } });
    const finalizados = await Processo.count({ where: { status: 'FINALIZADO' } });

    res.json({ total, abertos, emAnalise, finalizados });
  },

  async porSetor(req, res) {
    const dados = await Processo.findAll({
      attributes: [
        'setor_id',
        [Processo.sequelize.fn('COUNT', '*'), 'total'],
      ],
      include: [{ model: Setor, attributes: ['nome'] }],
      group: ['setor_id', 'Setor.id'],
    });

    const formatado = dados.map(d => ({
      setor: d.Setor.nome,
      total: Number(d.get('total')),
    }));

    res.json(formatado);
  },

  async movimentacoes(req, res) {
    const mov = await ProcessoMovimentacao.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['nome'] },
        { model: Processo, attributes: ['titulo'] },
      ],
    });

    res.json(mov);
  },
};
