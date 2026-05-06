const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const inscritoRoutes = require('./routes/inscritoRoutes');

const app = express();

// ================= CONFIG =================
app.use(cors());
app.use(express.json());

// 🔥 SERVIR FRONTEND (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 🔥 ROTA PADRÃO (abre o site)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ================= ROTAS API =================
app.use('/', authRoutes);
app.use('/', inscritoRoutes);

// ================= ERRO 404 =================
app.use((req, res) => {
  res.status(404).send("Rota não encontrada");
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});