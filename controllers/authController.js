const crypto = require('crypto');

const SENHA_ADMIN = "1234";
let TOKEN_ADMIN = null;

function login(req, res) {
  const { senha } = req.body;

  if (senha === SENHA_ADMIN) {
    TOKEN_ADMIN = crypto.randomBytes(16).toString('hex');
    return res.json({ ok: true, token: TOKEN_ADMIN });
  }

  res.status(401).json({ ok: false });
}

function getToken() {
  return TOKEN_ADMIN;
}

module.exports = { login, getToken };