const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não informado" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ erro: "Token mal formatado" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, "segredo_digital");

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ erro: "Usuário inválido" });
    }

    req.userId = user.id;
    req.setorId = user.setor_id;

    return next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido" });
  }
};
