const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../database/connection');

module.exports = {
  async login(req, res) {
    const { email, senha } = req.body;

    const result = await connection.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token });
  }
};
