const { Processo, Movimentacao } = require('../models');

module.exports = {
  async finalizar(req, res) {
    const { processo_id, observacao } = req.body;

    const processo = await Processo.findOne({
      where: {
        id: processo_id,
        setor_id: req.setorId,
      },
    });

    if (!processo) {
      return res.status(403).json({
        erro: 'Processo não pertence ao seu setor',
      });
    }

    if (processo.status === 'FINALIZADO') {
      return res.status(400).json({
        erro: 'Processo já está finalizado',
      });
    }

    processo.status = 'FINALIZADO';
    await processo.save();

    await Movimentacao.create({
      processo_id,
      usuario_id: req.userId,
      descricao: observacao || 'Processo finalizado',
    });

    return res.json({
      mensagem: 'Processo finalizado com sucesso',
      processo,
    });
  },
};
