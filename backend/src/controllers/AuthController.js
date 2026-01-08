const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = {
  async login(req, res) {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ erro: 'Usuário não encontrado' });
    }

    // 🔴 COMPARAÇÃO SEM HASH (DEV)
    if (senha !== user.senha) {
      return res.status(400).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, setor_id: user.setor_id },
      'segredo_digital',
      { expiresIn: '8h' }
    );

    return res.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        setor_id: user.setor_id,
      },
      token,
    });
  },
};
