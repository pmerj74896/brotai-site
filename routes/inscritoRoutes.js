const express = require('express');
const router = express.Router();

const { listar, criar } = require('../controllers/inscritoController');
const auth = require('../middlewares/authMiddleware');

// pública
router.post('/inscrever', criar);

// protegida
router.get('/dados', auth, listar);

module.exports = router;