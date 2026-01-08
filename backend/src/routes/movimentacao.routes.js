const express = require("express");
const MovimentacaoController = require("../controllers/MovimentacaoController");

const routes = express.Router();

routes.get("/:processo_id", MovimentacaoController.listar);
routes.post("/", MovimentacaoController.criar);

module.exports = routes;
