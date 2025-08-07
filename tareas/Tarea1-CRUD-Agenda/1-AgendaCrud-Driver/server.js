const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const agendasRouter = require('./routes/agendas');
const expressEjsLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de EJS
app.use(expressEjsLayouts)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Rutas
app.use('/', agendasRouter);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});