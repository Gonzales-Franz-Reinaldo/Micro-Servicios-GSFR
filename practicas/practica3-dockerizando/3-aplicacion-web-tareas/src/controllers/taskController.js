const Tarea = require('../models/Task');

// Obtener todas las tareas
exports.obtenerTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find();
        res.render('tasks/index', { tareas });
    } catch (error) {
        res.status(500).send('Error al obtener tareas');
    }
};


// Mostrar formulario para crear tarea
exports.formularioCrearTarea = (req, res) => {
    res.render('tasks/create');
};

// Crear una nueva tarea
exports.crearTarea = async (req, res) => {
    try {
        const { titulo, descripcion, estado } = req.body;
        const nuevaTarea = new Tarea({ titulo, descripcion, estado });
        await nuevaTarea.save();
        res.redirect('/tareas');
    } catch (error) {
        res.status(500).send('Error al crear tarea');
    }
};


// Mostrar una tarea
exports.obtenerTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) return res.status(404).send('Tarea no encontrada');
        res.render('tasks/show', { tarea });
    } catch (error) {
        res.status(500).send('Error al obtener tarea');
    }
};

// Mostrar formulario para editar tarea
exports.formularioEditarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) return res.status(404).send('Tarea no encontrada');
        res.render('tasks/edit', { tarea });
    } catch (error) {
        res.status(500).send('Error al obtener tarea');
    }
};

// Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        const { titulo, descripcion, estado } = req.body;
        await Tarea.findByIdAndUpdate(req.params.id, { titulo, descripcion, estado });
        res.redirect('/tareas');
    } catch (error) {
        res.status(500).send('Error al actualizar tarea');
    }
};

// Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        await Tarea.findByIdAndDelete(req.params.id);
        res.redirect('/tareas');
    } catch (error) {
        res.status(500).send('Error al eliminar tarea');
    }
};