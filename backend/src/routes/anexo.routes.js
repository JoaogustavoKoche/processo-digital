const express = require("express");
const upload = require("../config/upload");
const AnexoController = require("../controllers/AnexoController");

const routes = express.Router();

// Lista anexos do processo
routes.get("/:processo_id", AnexoController.listar);

// Upload de anexo (campo "arquivo")
routes.post("/:processo_id", upload.single("arquivo"), AnexoController.upload);

module.exports = routes;
