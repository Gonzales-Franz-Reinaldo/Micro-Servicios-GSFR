// npm install --save-dev @types/express-ejs-layouts
import express, { Express } from 'express';
import path from 'path';
import expressEjsLayouts from 'express-ejs-layouts';
import agendasRouter from './routes/agendas';
import initializeDatabase from './config/database';
import 'dotenv/config';

const app: Express = express();

// Configuración de EJS
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.set('layout', 'layouts/main');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Iniciar base de datos y servidor
initializeDatabase().then(() => {

    // app.use('/agendas', agendasRouter);

    // Ruta raíz - redirigir a agendas
    app.get('/', (req, res) => {
        res.redirect('/agendas');
    });

    app.use('/agendas', agendasRouter);


    // Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('No se pudo iniciar el servidor:', error);
});