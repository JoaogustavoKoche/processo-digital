const express = require('express');
const ProcessoController = require('../controllers/ProcessoController');
const authMiddleware = require('../middlewares/authMiddleware');

const routes = express.Router();

routes.use(authMiddleware);

routes.post('/', ProcessoController.criar);
routes.get('/', ProcessoController.listar);

module.exports = routes;
