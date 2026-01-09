const express = require("express");
const SetorController = require("../controllers/SetorController");

const routes = express.Router();

routes.get("/", SetorController.listar);

module.exports = routes;
