const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        nome: DataTypes.STRING,
        email: DataTypes.STRING,
        senha: DataTypes.STRING,
        setor_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'usuarios',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Setor, { foreignKey: 'setor_id' });
    this.hasMany(models.Processo, { foreignKey: 'usuario_id' });
    this.hasMany(models.Movimentacao, { foreignKey: 'usuario_id' });
  }
}

module.exports = User;
