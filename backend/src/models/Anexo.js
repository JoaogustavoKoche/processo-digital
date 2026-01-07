const { Model, DataTypes } = require('sequelize');

class Anexo extends Model {
  static init(sequelize) {
    return super.init(
      {
        nome: DataTypes.STRING,
        caminho: DataTypes.STRING,
        processo_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'anexos',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Processo, { foreignKey: 'processo_id' });
  }
}

module.exports = Anexo;
