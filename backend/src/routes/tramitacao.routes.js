const express = require("express");
const TramitacaoController = require("../controllers/TramitacaoController");

const routes = express.Router();

// PUT /tramitacoes/processos/:id/tramitar
routes.put("/processos/:id/tramitar", TramitacaoController.tramitar);

module.exports = routes;
