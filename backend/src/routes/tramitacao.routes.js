const express = require('express');
const TramitacaoController = require('../controllers/TramitacaoController');
const authMiddleware = require('../middlewares/authMiddleware');

const routes = express.Router();

routes.use(authMiddleware);

routes.post('/', TramitacaoController.tramitar);

module.exports = routes;
