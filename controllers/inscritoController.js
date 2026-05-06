const db = require('../config/database');

// listar inscritos (admin)
function listar(req, res) {
  try {
    const rows = db.prepare(
      "SELECT * FROM inscritos ORDER BY id DESC"
    ).all();

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao buscar dados");
  }
}

// criar inscrição
function criar(req, res) {
  const d = req.body;

  try {
    // verifica email duplicado
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
}

module.exports = { listar, criar };