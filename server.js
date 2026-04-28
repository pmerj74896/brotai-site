const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();

// ================= CONFIG =================
app.use(cors());
app.use(express.json());

// ================= BANCO =================
const db = new Database('banco.db');

const SENHA_ADMIN = "1234";

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
    return res.json({ ok: true });
  }

  res.status(401).json({ ok: false });
});

// ================= DADOS =================
app.get('/dados', (req, res) => {
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