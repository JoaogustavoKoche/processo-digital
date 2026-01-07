// src/models/ProcessoMovimentacao.js
module.exports = (sequelize, DataTypes) => {
  const ProcessoMovimentacao = sequelize.define(
    'ProcessoMovimentacao',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      processo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'processo_movimentacoes',
      timestamps: true,
    }
  );

  ProcessoMovimentacao.associate = (models) => {
    ProcessoMovimentacao.belongsTo(models.User, {
      foreignKey: 'usuario_id',
      as: 'usuario',
    });
  };

  return ProcessoMovimentacao;
};
