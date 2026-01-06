const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Setor = sequelize.define('Setor', {
  nome: DataTypes.STRING,
  sigla: DataTypes.STRING,
});

module.exports = Setor;
