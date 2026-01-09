const { Anexo, Movimentacao } = require("../models");

module.exports = {
  async listar(req, res) {
    try {
      const { processo_id } = req.params;

      const anexos = await Anexo.findAll({
        where: { processo_id: Number(processo_id) },
        order: [["createdAt", "DESC"]],
      });

      return res.json(anexos);
    } catch (err) {
      console.error("AnexoController.listar:", err);
      return res.status(500).json({
        erro: "Erro ao listar anexos.",
        detalhe: err?.message || String(err),
      });
    }
  },

  async upload(req, res) {
    try {
      const { processo_id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ erro: "Nenhum arquivo enviado." });
      }

      const usuario_id = req.body.usuario_id ? Number(req.body.usuario_id) : null;

      const anexo = await Anexo.create({
        processo_id: Number(processo_id),
        usuario_id,
        nome_original: file.originalname,
        nome_arquivo: file.filename,
        mime_type: file.mimetype,
        tamanho: file.size,
        url: `/uploads/${file.filename}`,
      });

      // registra na timeline (opcional)
      try {
        await Movimentacao.create({
          processo_id: Number(processo_id),
          usuario_id,
          descricao: `Anexo enviado: ${file.originalname}`,
        });
      } catch (e) {
        console.error("Falhou criar movimentação do anexo (não impede upload):", e);
      }

      return res.status(201).json(anexo);
    } catch (err) {
      console.error("AnexoController.upload:", err);
      return res.status(500).json({
        erro: "Erro ao enviar anexo.",
        detalhe: err?.message || String(err),
      });
    }
  },
};
