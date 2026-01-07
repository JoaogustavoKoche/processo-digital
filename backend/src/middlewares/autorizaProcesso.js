const { Processo } = require('../models');

module.exports = async (req, res, next) => {
  const processoId = req.params.processo_id || req.body.processo_id;

  const processo = await Processo.findByPk(processoId);

  if (!processo) {
    return res.status(404).json({ erro: 'Processo não encontrado' });
  }

  if (processo.setor_id !== req.setorId) {
    return res.status(403).json({ erro: 'Acesso negado ao processo' });
  }

  next();
};
