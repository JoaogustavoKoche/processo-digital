const { Processo, Movimentacao, Setor } = require('../models');

module.exports = {
  async tramitar(req, res) {
  const { processo_id, setor_destino_id, observacao } = req.body;

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
      erro: 'Processo finalizado não pode ser tramitado',
    });
  }

  const setorDestino = await Setor.findByPk(setor_destino_id);

  if (!setorDestino) {
    return res.status(400).json({
      erro: 'Setor de destino não existe',
    });
  }

  processo.setor_id = setor_destino_id;
  processo.status = 'EM ANALISE';
  await processo.save();

  await Movimentacao.create({
    processo_id,
    usuario_id: req.userId,
    descricao:
      observacao || `Processo tramitado para o setor ${setorDestino.nome}`,
  });

  return res.json({
    mensagem: 'Processo tramitado com sucesso',
    processo,
  });
}

};
