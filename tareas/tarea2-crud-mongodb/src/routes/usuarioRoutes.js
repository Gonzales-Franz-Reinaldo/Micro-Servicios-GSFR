const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.listarUsuarios);
router.get('/create', usuarioController.formCrearUsuario);
router.post('/create', usuarioController.crearUsuario);
router.get('/view/:id', usuarioController.verUsuario);
router.get('/edit/:id', usuarioController.formEditarUsuario);
router.put('/edit/:id', usuarioController.actualizarUsuario);
router.delete('/delete/:id', usuarioController.eliminarUsuario);

module.exports = router;