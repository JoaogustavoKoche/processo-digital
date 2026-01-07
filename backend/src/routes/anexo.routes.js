const express = require('express');
const AnexoController = require('../controllers/AnexoController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const routes = express.Router();

routes.use(authMiddleware);

routes.post('/', upload.single('arquivo'), AnexoController.upload);
routes.get('/:processo_id', AnexoController.listar);

module.exports = routes;
