const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressEjsLayouts = require('express-ejs-layouts');

require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

// Conectamos a al base de datos
require('./config/db');

// configuramos las vistas
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.set('layout', 'layouts/main');

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')));

// rutas
app.use('/usuarios', usuarioRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.redirect('/usuarios');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});