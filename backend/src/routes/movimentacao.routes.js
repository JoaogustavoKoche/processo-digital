const express = require('express');
const MovimentacaoController = require('../controllers/MovimentacaoController');
const authMiddleware = require('../middlewares/authMiddleware');

const routes = express.Router();

routes.use(authMiddleware);

routes.post('/', MovimentacaoController.criar);
routes.get('/:processo_id', MovimentacaoController.listar);

module.exports = routes;
