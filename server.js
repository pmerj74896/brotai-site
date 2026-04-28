const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

// ================= CONFIG =================
app.use(cors());
app.use(express.json());

// ================= BANCO =================
const db = new Database('banco.db');

const SENHA_ADMIN = "1234";
let TOKEN_ADMIN = null;

// cria tabela se não existir
db.prepare(`
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
`).run();

// ================= LOGIN =================
app.post('/login', (req, res) => {
  const { senha } = req.body;

  if (senha === SENHA_ADMIN) {
    TOKEN_ADMIN = crypto.randomBytes(16).toString('hex');
    return res.json({ ok: true, token: TOKEN_ADMIN });
  }

  res.status(401).json({ ok: false });
});

// ================= PROTEÇÃO =================
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (token && token === TOKEN_ADMIN) {
    return next();
  }

  return res.status(403).json({ erro: "Acesso negado" });
}

// ================= DADOS PROTEGIDOS =================
app.get('/dados', auth, (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM inscritos ORDER BY id DESC").all();
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao buscar dados");
  }
});

// ================= INSCRIÇÃO =================
app.post('/inscrever', (req, res) => {

  const d = req.body;

  try {
    // 🚫 BLOQUEAR EMAIL DUPLICADO
    const existe = db.prepare(
      "SELECT * FROM inscritos WHERE email = ?"
    ).get(d.email);

    if (existe) {
      return res.status(400).send("Email já cadastrado");
    }

    const stmt = db.prepare(`
      INSERT INTO inscritos (
        nome, email,
        genero, raca,
        pcd, pcd_desc,
        regiao, bairro,
        atividade,
        origem
      ) VALUES (?,?,?,?,?,?,?,?,?,?)
    `);

    stmt.run(
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
    );

    res.send("OK");

  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao salvar");
  }

});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});