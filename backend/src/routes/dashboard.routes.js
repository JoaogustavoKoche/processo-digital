const express = require('express');
const DashboardController = require('../controllers/DashboardController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/dashboard/resumo', auth, DashboardController.resumo);
router.get('/dashboard/setores', auth, DashboardController.porSetor);
router.get('/dashboard/movimentacoes', auth, DashboardController.movimentacoes);

module.exports = router;
