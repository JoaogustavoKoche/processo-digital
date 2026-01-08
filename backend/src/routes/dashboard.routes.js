const express = require('express');
const DashboardController = require('../controllers/DashboardController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/dashboard/resumo', DashboardController.resumo);
router.get('/dashboard/setores', DashboardController.porSetor);
router.get('/dashboard/movimentacoes', DashboardController.movimentacoes);

module.exports = router;
