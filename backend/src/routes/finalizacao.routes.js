const express = require('express');
const FinalizacaoController = require('../controllers/FinalizacaoController');
const authMiddleware = require('../middlewares/authMiddleware');

const routes = express.Router();

routes.use(authMiddleware);

routes.post('/', FinalizacaoController.finalizar);

module.exports = routes;
