const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Obtener todas las agendas
router.get('/', async (req, res)=>{
    try{
        const query = 'SELECT * FROM agenda';
        const [rows] = await db.query(query);
        res.render('agenda/index', { agendas: rows, title: 'Lista de Agendas' });
    }catch(error){
        console.error('Error al obtener agendas:', error);
        res.status(500).send('Error interno del servidor..');
    }
});


router.get('/create', (req, res) => {
    res.render('agenda/create', { title: 'Crear Agenda' });
});

// Crear una nueva agenda
router.post('/create', async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    try {
        const query = 'INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(query, [nombres, apellidos, fecha_nacimiento, direccion, celular, correo]);
        res.redirect('/');
    } catch (error) {
        console.error('Error al crear agenda:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Formulario para editar una agenda
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM agenda WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) {
            res.status(404).send('Agenda no encontrada.');
        } 
        res.render('agenda/edit', { agenda: rows[0], title: 'Editar Agenda' });
    } catch (error) {
        console.error('Error al obtener agenda:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Actualizar una agenda
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    try {
        const query = 'UPDATE agenda SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, celular = ?, correo = ? WHERE id = ?';
        await db.query(query, [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, id]);
        res.redirect('/');
    } catch (error) {
        console.error('Error al actualizar agenda:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Para leer una agenda específica
router.get('/view/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM agenda WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) {
            res.status(404).send('Agenda no encontrada.');
        } 

        res.render('agenda/view', { agenda: rows[0], title: 'Leer Agenda' });
    } catch (error) {
        console.error('Error al obtener agenda:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Eliminar una agenda

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM agenda WHERE id = ?';
        await db.query(query, [id]);
        res.redirect('/');
    } catch (error) {
        console.error('Error al eliminar agenda:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

module.exports = router;