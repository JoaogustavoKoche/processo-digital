const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const { User, Setor } = require('./src/models');

async function seed() {
  await sequelize.sync();

  const setor = await Setor.create({
    nome: 'Administração',
    sigla: 'ADM',
  });

  const senhaHash = await bcrypt.hash('123456', 8);

  await User.create({
    nome: 'Administrador',
    email: 'admin@admin.com',
    senha: senhaHash,
    perfil: 'admin',
    SetorId: setor.id,
  });

  console.log('Usuário admin criado');
}

seed();
