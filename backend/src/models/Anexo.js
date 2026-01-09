const { Model, DataTypes } = require("sequelize");

class Anexo extends Model {
  static init(sequelize) {
    return super.init(
      {
        processo_id: DataTypes.INTEGER,
        usuario_id: DataTypes.INTEGER,
        nome_original: DataTypes.STRING,
        nome_arquivo: DataTypes.STRING,
        mime_type: DataTypes.STRING,
        tamanho: DataTypes.INTEGER,
        url: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "anexos",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Processo, { foreignKey: "processo_id" });
    this.belongsTo(models.User, { foreignKey: "usuario_id" });
  }
}

module.exports = Anexo;
