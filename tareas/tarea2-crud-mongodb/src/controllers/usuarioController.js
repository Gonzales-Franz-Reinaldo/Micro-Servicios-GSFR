const Usuario = require('../models/Usuario');

// Listar todos
exports.listarUsuarios = async (req, res) => {
    const usuarios = await Usuario.find();
    if (!usuarios || usuarios.length === 0) {
        return res.status(404).send('No se encontraron usuarios');
    }
    res.render('usuarios/index', { usuarios, title: 'Lista de Usuarios' });
}


// Mostrar formulario crear
exports.formCrearUsuario = (req, res) => {
    res.render('usuarios/create', { title: 'Crear Usuario' });
}

// Guardar usuario
exports.crearUsuario = async (req, res) => {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.redirect('/usuarios');
}

// Ver usuario
exports.verUsuario = async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
    }
    res.render('usuarios/view', { usuario, title: 'Ver Usuario' });
}

// Mostrar formulario editar
exports.formEditarUsuario  = async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
    }
    res.render('usuarios/edit', { usuario, title: 'Editar Usuario' });
}

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
    }
    res.redirect('/usuarios');
}

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
    }
    res.redirect('/usuarios');
}

