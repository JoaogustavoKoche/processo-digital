const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ error: 'Token nao informado'});
    }

    const [, token] = authHeader.split(' ');

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        return next();
    }catch (err) {
        return res.status(401).json({ error: 'Token invalido ou expirado'});
    }
};