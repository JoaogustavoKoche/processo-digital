const express = require("express");
const ProcessoController = require("../controllers/ProcessoController");

const routes = express.Router();

routes.get("/", ProcessoController.listar);
routes.get("/:id", ProcessoController.detalhe);
routes.post("/", ProcessoController.criar);

module.exports = routes;
