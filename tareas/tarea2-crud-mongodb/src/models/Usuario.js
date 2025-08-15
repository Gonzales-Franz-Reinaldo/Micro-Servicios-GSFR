const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombres: String,
    apellidos: String,
    fecha_nacimiento: String,
    direccion: String,
    celular: String,
    correo: String,
    edad: Number
})

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;