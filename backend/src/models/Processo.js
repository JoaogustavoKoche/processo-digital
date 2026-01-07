const { Model, DataTypes } = require('sequelize');

class Processo extends Model {
  static init(sequelize) {
    return super.init(
      {
        titulo: DataTypes.STRING,
        descricao: DataTypes.TEXT,
        status: {
          type: DataTypes.STRING,
          defaultValue: 'ABERTO',
        },
        setor_id: DataTypes.INTEGER,
        usuario_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'processos',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'usuario_id' });
    this.belongsTo(models.Setor, { foreignKey: 'setor_id' });
    this.hasMany(models.Movimentacao, { foreignKey: 'processo_id' });
    this.hasMany(models.Anexo, { foreignKey: 'processo_id' });
  }
}

module.exports = Processo;
