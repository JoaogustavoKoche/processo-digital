const express = require("express");
const UserAdminController = require("../controllers/UserAdminController");
const auth = require("../middlewares/auth"); // seu middleware
const onlyTI = require("../middlewares/onlyTI");

const routes = express.Router();

routes.get("/", auth, onlyTI, UserAdminController.listar);
routes.post("/", auth, onlyTI, UserAdminController.criar);

module.exports = routes;
