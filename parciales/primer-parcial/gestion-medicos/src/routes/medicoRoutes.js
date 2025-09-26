const express = require('express');
const medicoController = require('../controllers/medicoController');

const router = express.Router();

// Definir rutas
router.get('/', medicoController.getAll);
router.get('/:id', medicoController.getById);
router.post('/', medicoController.create);
router.put('/:id', medicoController.update);
router.delete('/:id', medicoController.delete);

module.exports = router;