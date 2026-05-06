const Database = require('better-sqlite3');

// 👉 usa só UM banco (apaga o outro se tiver)
const db = new Database('banco.db');

// cria tabela se não existir
db.prepare(`
CREATE TABLE IF NOT EXISTS inscritos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT UNIQUE,
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

module.exports = db;