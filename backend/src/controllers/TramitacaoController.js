// backend/src/controllers/TramitacaoController.js
const { Processo, Setor, Movimentacao } = require("../models");

module.exports = {
  async tramitar(req, res) {
    try {
      const { id } = req.params; // id do processo
      const { setor_destino_id, descricao } = req.body;

      if (!setor_destino_id) {
        return res.status(400).json({ erro: "setor_destino_id é obrigatório." });
      }

      // 1) busca processo
      const processo = await Processo.findByPk(id);
      if (!processo) {
        return res.status(404).json({ erro: "Processo não encontrado." });
      }

      // 2) REGRA PRINCIPAL: processo precisa estar no setor do usuário
      // req.setorId vem do middleware auth
      if (Number(processo.setor_id) !== Number(req.setorId)) {
        return res.status(403).json({
          erro: "Você só pode tramitar processos que estão no seu setor.",
        });
      }

      // 3) valida setor destino
      const setorDestino = await Setor.findByPk(setor_destino_id);
      if (!setorDestino) {
        return res.status(404).json({ erro: "Setor de destino não encontrado." });
      }

      // 4) evita tramitar para o mesmo setor
      if (Number(setor_destino_id) === Number(processo.setor_id)) {
        return res.status(400).json({ erro: "O setor de destino deve ser diferente do atual." });
      }

      // 5) guarda setor origem para registrar movimentação
      const setorOrigemId = processo.setor_id;

      // 6) atualiza processo (setor e status opcional)
      processo.setor_id = Number(setor_destino_id);
      // opcional: muda status automaticamente
      // processo.status = "EM_ANALISE";
      await processo.save();

      // 7) registra movimentação (linha do tempo)
      const texto =
        descricao?.trim() ||
        `Tramitado do setor ${setorOrigemId} para o setor ${setor_destino_id}`;

      await Movimentacao.create({
        processo_id: processo.id,
        usuario_id: req.userId,
        descricao: texto,
      });

      return res.json({
        ok: true,
        processo,
      });
    } catch (err) {
      console.error("TramitacaoController.tramitar erro:", err);
      return res.status(500).json({ erro: "Erro ao tramitar processo." });
    }
  },
};
