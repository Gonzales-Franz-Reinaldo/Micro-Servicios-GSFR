const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const register = async (req, res) => {
    try {
        const { correo, password } = req.body;

        logger.info('Iniciando registro de usuario', { correo });

        const existingUser = await User.findOne({ where: { correo } });
        if (existingUser) {
            logger.warn('Intento de registro con correo existente', { correo });
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const user = await User.create({ correo, password });

        const token = jwt.sign(
            { id: user.id, correo: user.correo },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        logger.info('Usuario registrado exitosamente', { userId: user.id, correo });
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: user.id,
                correo: user.correo
            }
        });
    } catch (error) {
        logger.error('Error en registro:', error);
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        logger.info('Intento de login', { correo });

        const user = await User.findOne({ where: { correo } });
        if (!user) {
            logger.warn('Intento de login con correo no registrado', { correo });
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            logger.warn('Intento de login con contraseña incorrecta', { correo });
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, correo: user.correo },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        logger.info('Login exitoso', { userId: user.id, correo });
        res.json({
            message: 'Autenticación exitosa',
            token,
            user: {
                id: user.id,
                correo: user.correo
            }
        });
    } catch (error) {
        logger.error('Error en login:', error);
        res.status(500).json({ message: 'Error al autenticar usuario', error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        logger.info('Obteniendo perfil del usuario', { userId: req.user.id });
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'correo', 'createdAt']
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ user });
    } catch (error) {
        logger.error('Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info('Obteniendo usuario por ID', { userId: id });

        const user = await User.findByPk(id, {
            attributes: ['id', 'correo', 'createdAt']
        });
        
        if (!user) {
            logger.warn('Usuario no encontrado', { userId: id });
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        logger.info('Usuario encontrado', { userId: id, correo: user.correo });
        res.json({ user });
    } catch (error) {
        logger.error('Error al obtener usuario por ID:', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        logger.info('Listando todos los usuarios');
        const users = await User.findAll({
            attributes: ['id', 'correo', 'createdAt']
        });
        res.json({ users });
    } catch (error) {
        logger.error('Error al listar usuarios:', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { correo, password } = req.body;

        logger.info('Actualizando usuario', { userId: id });

        if (req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'No autorizado para actualizar este usuario' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (correo) user.correo = correo;
        if (password) user.password = password;

        await user.save();

        logger.info('Usuario actualizado', { userId: id });
        res.json({
            message: 'Usuario actualizado exitosamente',
            user: {
                id: user.id,
                correo: user.correo
            }
        });
    } catch (error) {
        logger.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info('Eliminando usuario', { userId: id });

        if (req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'No autorizado para eliminar este usuario' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.destroy();

        logger.info('Usuario eliminado', { userId: id });
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        logger.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser
};