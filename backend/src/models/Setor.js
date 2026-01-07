const { Model, DataTypes } = require('sequelize');

class Setor extends Model {
  static init(sequelize) {
    return super.init(
      {
        nome: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'setores',
      }
    );
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'setor_id' });
    this.hasMany(models.Processo, { foreignKey: 'setor_id' });
  }
}

module.exports = Setor;
