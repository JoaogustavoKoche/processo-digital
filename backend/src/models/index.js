const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./User");
const Setor = require("./Setor");
const Processo = require("./Processo");
const Movimentacao = require("./Movimentacao");
const Anexo = require("./Anexo");

User.init(sequelize);
Setor.init(sequelize);
Processo.init(sequelize);
Movimentacao.init(sequelize);
Anexo.init(sequelize);

const models = { User, Setor, Processo, Movimentacao, Anexo };

Object.values(models)
  .filter((m) => typeof m.associate === "function")
  .forEach((m) => m.associate(models));

module.exports = { sequelize, ...models };
