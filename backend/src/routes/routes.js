const express = require('express');
const auth = require('./middlewares/auth');
const ProcessoController = require('./controllers/ProcessoController');
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

routes.post('/processos', auth, ProcessoController.criar);
routes.get('/processos', auth, ProcessoController.listar);

module.exports = routes;
