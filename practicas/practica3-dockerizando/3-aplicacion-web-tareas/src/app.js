const express = require('express');
const methodOverride = require('method-override');
const conectarDB = require('./config/database');
const tareasRutas = require('./routes/tasks');
const expressEjsLayouts = require('express-ejs-layouts');
require('dotenv').config();

const path = require('path');

const app = express();

// Conectar a MongoDB
conectarDB();

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(expressEjsLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')));
app.set('layout', 'layouts/main');

// Rutas
app.use('/tareas', tareasRutas);

// Ruta raíz
app.get('/', (req, res) => {
    res.redirect('/tareas');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Conectado a MongoDB en ${process.env.MONGO_URI}`);
    console.log("La aplicación está disponible en http://localhost:" + PORT);
    
});