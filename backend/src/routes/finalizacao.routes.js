const express = require("express");
const FinalizacaoController = require("../controllers/FinalizacaoController");
const auth = require("../middlewares/auth");

const routes = express.Router();

// PATCH /finalizacoes/:id
routes.patch("/:id", auth, FinalizacaoController.finalizar);

module.exports = routes;
