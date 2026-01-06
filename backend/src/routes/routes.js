const express = require('express');
const auth = require('./middlewares/auth');

const routes = express.Router();

routes.post('/login', AuthController.login);

// 🔒 rota protegida
routes.get('/dashboard', auth, (req, res) => {
  res.json({
    message: 'Acesso autorizado',
    userId: req.userId,
  });
});

module.exports = routes;
