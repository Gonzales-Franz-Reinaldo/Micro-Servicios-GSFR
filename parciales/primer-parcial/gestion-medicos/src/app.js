const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const medicoRoutes = require('./routes/medicoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar base de datos
initializeDatabase();

// Rutas
app.use('/medico', medicoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Médicos funcionando correctamente' });
});

module.exports = app;