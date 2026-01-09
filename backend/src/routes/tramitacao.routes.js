// backend/src/routes/tramitacao.routes.js
const express = require("express");
const TramitacaoController = require("../controllers/TramitacaoController");
const auth = require("../middlewares/auth");

const routes = express.Router();

// PATCH /tramitacoes/:id
routes.patch("/:id", auth, TramitacaoController.tramitar);

module.exports = routes;
