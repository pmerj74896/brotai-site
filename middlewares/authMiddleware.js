const { getToken } = require('../controllers/authController');

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (token && token === getToken()) {
    return next();
  }

  return res.status(403).json({ erro: "Acesso negado" });
}

module.exports = auth;