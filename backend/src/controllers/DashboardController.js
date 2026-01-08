const { Processo, Movimentacao, Setor, User, sequelize } = require("../models");

module.exports = {
  async resumo(req, res) {
    try {
      // total
      const total = await Processo.count();

      // Tenta contar por status, mas se a coluna não existir, devolve 0 sem quebrar
      let abertos = 0;
      let emAnalise = 0;
      let finalizados = 0;

      try {
        abertos = await Processo.count({ where: { status: "ABERTO" } });
        emAnalise = await Processo.count({ where: { status: "EM_ANALISE" } });
        finalizados = await Processo.count({ where: { status: "FINALIZADO" } });
      } catch (e) {
        // Se sua tabela ainda não tiver a coluna status, não derruba o endpoint
        abertos = 0;
        emAnalise = 0;
        finalizados = 0;
      }

      return res.json({ total, abertos, emAnalise, finalizados });
    } catch (err) {
      console.error("DashboardController.resumo erro:", err);
      return res.status(500).json({ erro: "Erro ao gerar resumo do dashboard." });
    }
  },

  async porSetor(req, res) {
    try {
      // Faz join seguro: Setor + Processos
      // Se não existir relação, cai no fallback.
      try {
        const setores = await Setor.findAll({
          attributes: ["id", "nome"],
          include: [
            {
              model: Processo,
              attributes: [],
              required: false,
            },
          ],
          group: ["Setor.id"],
          raw: true,
          subQuery: false,
        });

        // Como o include sem COUNT pode variar, fazemos fallback com query simples:
        // Então vamos pegar todos os setores e contar manualmente.
        const lista = await Setor.findAll({ attributes: ["id", "nome"], raw: true });

        const result = [];
        for (const s of lista) {
          const total = await Processo.count({ where: { setor_id: s.id } });
          result.push({ setor: s.nome, total });
        }

        return res.json(result);
      } catch (e) {
        // fallback seguro
        const lista = await Setor.findAll({ attributes: ["id", "nome"], raw: true });

        const result = [];
        for (const s of lista) {
          const total = await Processo.count({ where: { setor_id: s.id } });
          result.push({ setor: s.nome, total });
        }

        return res.json(result);
      }
    } catch (err) {
      console.error("DashboardController.porSetor erro:", err);
      return res.status(500).json({ erro: "Erro ao gerar processos por setor." });
    }
  },

  async movimentacoes(req, res) {
    try {
      // pega as últimas movimentações com dados do processo e usuário
      const lista = await Movimentacao.findAll({
        limit: 10,
        order: [["createdAt", "DESC"]],
        include: [
          { model: Processo, attributes: ["id", "titulo"], required: false },
          { model: User, attributes: ["id", "nome"], required: false },
        ],
      });

      return res.json(lista);
    } catch (err) {
      console.error("DashboardController.movimentacoes erro:", err);
      return res.status(500).json({ erro: "Erro ao buscar movimentações." });
    }
  },
};
