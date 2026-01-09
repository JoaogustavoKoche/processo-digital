const { Processo, Movimentacao, sequelize } = require("../models");

module.exports = {
  async finalizar(req, res) {
    const { id } = req.params;
    const { usuario_id } = req.body;

    try {
      const result = await sequelize.transaction(async (t) => {
        const processo = await Processo.findByPk(id, { transaction: t });

        if (!processo) {
          return { status: 404, erro: "Processo não encontrado" };
        }

        // Se não existir coluna status no model/banco, retorna erro amigável
        if (!Object.prototype.hasOwnProperty.call(processo.dataValues, "status")) {
          return { status: 400, erro: "A coluna 'status' não existe em processos" };
        }

        if (processo.status === "FINALIZADO") {
          return { status: 400, erro: "Processo já está finalizado" };
        }

        processo.status = "FINALIZADO";
        await processo.save({ transaction: t });

        await Movimentacao.create(
          {
            processo_id: processo.id,
            usuario_id: usuario_id || processo.usuario_id || null,
            descricao: `Processo finalizado.`,
          },
          { transaction: t }
        );

        return { status: 200, data: processo };
      });

      if (result.erro) return res.status(result.status).json({ erro: result.erro });
      return res.json(result.data);
    } catch (err) {
      console.error("Erro finalizar:", err);
      return res.status(500).json({ erro: "Erro ao finalizar processo" });
    }
  },
};
