const { Processo, Movimentacao, Setor, sequelize } = require("../models");

module.exports = {
  async tramitar(req, res) {
    try {
      const { id } = req.params; // id do processo
      const { setor_destino_id, usuario_id, descricao } = req.body;

      if (!setor_destino_id) {
        return res.status(400).json({ erro: "Informe o setor_destino_id." });
      }

      const result = await sequelize.transaction(async (t) => {
        const processo = await Processo.findByPk(id, { transaction: t });
        if (!processo) return { status: 404, erro: "Processo não encontrado." };

        // bloqueia se finalizado
        if (String(processo.status || "").toUpperCase() === "FINALIZADO") {
          return { status: 400, erro: "Processo finalizado não pode ser tramitado." };
        }

        const setorDestino = await Setor.findByPk(setor_destino_id, { transaction: t });
        if (!setorDestino) return { status: 400, erro: "Setor destino inválido." };

        const setorOrigemId = processo.setor_id;

        if (Number(setorOrigemId) === Number(setor_destino_id)) {
          return { status: 400, erro: "O setor destino deve ser diferente do setor atual." };
        }

        // atualiza setor do processo
        processo.setor_id = Number(setor_destino_id);
        await processo.save({ transaction: t });

        // registra movimentação
        const texto =
          descricao && descricao.trim()
            ? descricao.trim()
            : `Tramitado do setor ${setorOrigemId || "-"} para ${setorDestino.nome}.`;

        await Movimentacao.create(
          {
            processo_id: processo.id,
            usuario_id: usuario_id ? Number(usuario_id) : null,
            descricao: texto,
          },
          { transaction: t }
        );

        return { status: 200, data: processo };
      });

      if (result.erro) return res.status(result.status).json({ erro: result.erro });
      return res.json(result.data);
    } catch (err) {
      console.error("Erro tramitar:", err);
      return res.status(500).json({ erro: "Erro ao tramitar processo." });
    }
  },
};
