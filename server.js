const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ================= SESSÃO =================
app.use(session({
  secret: "brota-admin-2026",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: true
  }
}));

const db = new sqlite3.Database('./banco.db');

const SENHA_ADMIN = "1234";

// ================= BANCO =================
db.run(`
CREATE TABLE IF NOT EXISTS inscritos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT,
  genero TEXT,
  raca TEXT,
  pcd TEXT,
  pcd_desc TEXT,
  regiao TEXT,
  bairro TEXT,
  atividade TEXT,
  origem TEXT
)
`);

// ================= LOGIN =================
app.post('/login', (req, res) => {
  const { senha } = req.body;

  if (senha === SENHA_ADMIN) {
    req.session.admin = true;
    return res.json({ ok: true });
  }

  res.status(401).json({ ok: false });
});

// ================= LOGOUT =================
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// ================= PROTEÇÃO =================
function auth(req, res, next) {
  if (req.session && req.session.admin === true) {
    return next();
  }

  return res.status(403).json({ erro: "Acesso negado" });
}

// ================= DADOS PROTEGIDOS =================
app.get('/dados', auth, (req, res) => {
  db.all("SELECT * FROM inscritos ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// ================= INSCRIÇÃO =================
app.post('/inscrever', (req, res) => {

  const d = req.body;

  db.run(`
    INSERT INTO inscritos (
      nome, email,
      genero, raca,
      pcd, pcd_desc,
      regiao, bairro,
      atividade,
      origem
    ) VALUES (?,?,?,?,?,?,?,?,?,?)
  `,
  [
    d.nome || "",
    d.email || "",
    d.genero || "",
    d.raca || "",
    d.pcd || "",
    d.pcd_desc || "",
    d.regiao || "",
    d.bairro || "",
    d.atividade || "",
    d.origem || ""
  ]);

  res.send("OK");
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Servidor rodando http://localhost:3000");
});