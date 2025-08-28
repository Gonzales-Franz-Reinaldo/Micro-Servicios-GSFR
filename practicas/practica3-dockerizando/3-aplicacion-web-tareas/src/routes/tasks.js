const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');


router.get('/', taskController.obtenerTareas);
router.get('/nueva', taskController.formularioCrearTarea);
router.post('/', taskController.crearTarea);
router.get('/:id', taskController.obtenerTarea);
router.get('/:id/editar', taskController.formularioEditarTarea);
router.put('/:id', taskController.actualizarTarea);
router.delete('/:id', taskController.eliminarTarea);

module.exports = router;