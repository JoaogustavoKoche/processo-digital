const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const Setor = require('./Setor');
const Processo = require('./Processo');
const Movimentacao = require('./Movimentacao');
const Anexo = require('./Anexo');

const models = {
  User: User.init(sequelize),
  Setor: Setor.init(sequelize),
  Processo: Processo.init(sequelize),
  Movimentacao: Movimentacao.init(sequelize),
  Anexo: Anexo.init(sequelize),
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
