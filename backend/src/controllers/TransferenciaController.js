const { Processo, ProcessoMovimentacao } = require('../models');

module.exports = {
  async transferir(req, res) {
    const { processoId } = req.params;
    const { setorDestinoId } = req.body;

    const processo = await Processo.findByPk(processoId);

    if (!processo) {
      return res.status(404).json({ erro: 'Processo não encontrado' });
    }

    if (processo.setor_id !== req.setorId) {
      return res.status(403).json({ erro: 'Processo não pertence ao seu setor' });
    }

    processo.setor_id = setorDestinoId;
    await processo.save();

    await ProcessoMovimentacao.create({
      processo_id: processo.id,
      usuario_id: req.userId,
      descricao: `Processo transferido para o setor ${setorDestinoId}`,
    });

    return res.json({ sucesso: true });
  },
};
