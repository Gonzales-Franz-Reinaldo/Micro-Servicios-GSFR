import express, { Router } from 'express';
import { getConnection } from 'typeorm';
import { Agenda } from '../entities/Agenda';

const router: Router = express.Router();

// Listar agendas
router.get('/', async (req, res) => {
    try {
        const agendaRepository = getConnection().getRepository(Agenda);
        const agendas = await agendaRepository.find();
        res.render('agenda/index', { agendas, title: 'Lista de Agendas' });
    } catch (error) {
        console.error('Error al obtener las agendas:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Formulario para crear agenda
router.get('/create', (req, res) => {
    res.render('agenda/create', { title: 'Crear Agenda' });
});

// Crear agenda
router.post('/', async (req, res) => {
    try {
        const agendaRepository = getConnection().getRepository(Agenda);
        const agenda = agendaRepository.create(req.body);
        await agendaRepository.save(agenda);
        res.redirect('/agendas');
    } catch (error) {
        console.error('Error al crear agenda:', error);
        res.status(500).send('Error al crear agenda');
    }
});

// Formulario para editar agenda
router.get('/edit/:id', async (req, res) => {
    try {
        const agendaRepository = getConnection().getRepository(Agenda);
        const agenda = await agendaRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!agenda) {
            return res.status(404).send('Agenda no encontrada');
        }
        res.render('agenda/edit', { agenda, title: 'Editar Agenda' });
    } catch (error) {
        console.error('Error al obtener la agenda:', error);
        res.status(500).send('Error en el servidor');
    }
});


// Actualizar agenda
router.post('/edit/:id', async (req, res) => {
    try {
        const agendaRepository = getConnection().getRepository(Agenda);
        await agendaRepository.update(req.params.id, req.body);
        res.redirect('/agendas');
    } catch (error) {
        console.error('Error al actualizar agenda:', error);
        res.status(500).send('Error al actualizar agenda');
    }
});

// Ver detalles de una agenda
router.get('/view/:id', async (req, res) => {
    try {
        const agendaRepository = getConnection().getRepository(Agenda);
        const agenda = await agendaRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!agenda) {
            return res.status(404).send('Agenda no encontrada');
        }
        res.render('agenda/view', { agenda, title: 'Detalles de la Agenda' });
    } catch (error) {
        console.error('Error al obtener la agenda:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Eliminar agenda
router.post('/delete/:id', async (req, res) => {
    try {
        const agendaRepository = getConnection().getRepository(Agenda);
        await agendaRepository.delete(req.params.id);
        res.redirect('/agendas');
    } catch (error) {
        console.error('Error al eliminar agenda:', error);
        res.status(500).send('Error al eliminar agenda');
    }
});

export default router;