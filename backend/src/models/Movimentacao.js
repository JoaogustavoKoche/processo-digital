const { Model, DataTypes } = require('sequelize');

class Movimentacao extends Model {
  static init(sequelize) {
    return super.init(
      {
        descricao: DataTypes.TEXT,
        processo_id: DataTypes.INTEGER,
        usuario_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'processo_movimentacoes',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Processo, { foreignKey: 'processo_id' });
    this.belongsTo(models.User, { foreignKey: 'usuario_id' });
  }
}

module.exports = Movimentacao;
