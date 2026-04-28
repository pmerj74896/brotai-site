const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();

// ================= CONFIG =================
app.use(cors());
app.use(express.json());

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
    return res.json({ ok: true });
  }

  res.status(401).json({ ok: false });
});

// ================= DADOS =================
app.get('/dados', (req, res) => {
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
  ],
  (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Erro");
    }
    res.send("OK");
  });

});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});