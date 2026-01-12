const { Processo, Movimentacao } = require("../models");

module.exports = {
  async finalizar(req, res) {
    try {
      const { id } = req.params; // id do processo
      const { descricao } = req.body;

      const processo = await Processo.findByPk(id);

      if (!processo) {
        return res.status(404).json({ erro: "Processo não encontrado." });
      }

      // ✅ Regra: só finaliza se o processo estiver no setor do usuário
      if (Number(processo.setor_id) !== Number(req.setorId)) {
        return res.status(403).json({
          erro: "Você só pode finalizar processos que estão no seu setor.",
        });
      }

      // evita finalizar 2x
      if (processo.status === "FINALIZADO") {
        return res.status(400).json({ erro: "Processo já está finalizado." });
      }

      processo.status = "FINALIZADO";
      await processo.save();

      // registra no histórico
      await Movimentacao.create({
        processo_id: processo.id,
        usuario_id: req.userId,
        descricao: descricao?.trim() || "Processo finalizado.",
      });

      return res.json({ ok: true, processo });
    } catch (err) {
      console.error("FinalizacaoController.finalizar erro:", err);
      return res.status(500).json({ erro: "Erro ao finalizar processo." });
    }
  },
};
