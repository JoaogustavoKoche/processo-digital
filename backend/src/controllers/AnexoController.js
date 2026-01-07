const { Anexo, Processo } = require('../models');

module.exports = {
  async upload(req, res) {
    const { processo_id } = req.body;

    const processo = await Processo.findOne({
      where: {
        id: processo_id,
        setor_id: req.setorId,
      },
    });

    if (!processo) {
      return res.status(403).json({ erro: 'Processo não pertence ao seu setor' });
    }

    const anexo = await Anexo.create({
      nome: req.file.originalname,
      caminho: req.file.filename,
      processo_id,
    });

    return res.status(201).json(anexo);
  },

  async listar(req, res) {
    const { processo_id } = req.params;

    const anexos = await Anexo.findAll({
      where: { processo_id },
      order: [['createdAt', 'ASC']],
    });

    return res.json(anexos);
  },
};
