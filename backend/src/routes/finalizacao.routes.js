const express = require("express");
const FinalizacaoController = require("../controllers/FinalizacaoController");
// const auth = require("../middlewares/authMiddleware"); // se voltar token depois

const routes = express.Router();

// Você já usa app.use('/finalizacoes', finalizacaoRoutes)
routes.put("/processos/:id/finalizar", FinalizacaoController.finalizar);

module.exports = routes;
