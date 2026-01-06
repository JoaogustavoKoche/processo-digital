const User = require('./User');
const Setor = require('./Setor');

Setor.hasMany(User);
User.belongsTo(Setor);

module.exports = {
  User,
  Setor,
};
