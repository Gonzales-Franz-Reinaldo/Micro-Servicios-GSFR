const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    
    if (!token) {
        logger.warn('No token proporcionado');
        return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // const { id, correo, rol, timestamp } = decoded; 
        // 
        // if (!id || !correo || !rol) {
        //     logger.warn('Token inválido: falta ID, correo o rol');
        //     return res.status(401).json({ message: 'Token inválido: datos incompletos' });
        // }
        
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'correo']
        });
        
        if (!user) {
            logger.warn('Usuario no encontrado para el token', { userId: decoded.id });
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        
        req.user = user;
        next();
    } catch (err) {
        logger.error('Error al verificar token:', err);
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

const isAdmin = (req, res, next) => {

    // if (req.user.role_from_token !== 'admin') { 
    //     logger.warn(`Intento de acceso denegado a ruta admin por usuario ${req.user.id}`);
    //     return res.status(403).json({ message: 'Acceso denegado: Se requiere rol Admin' });
    // }
    //

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: Requiere rol admin' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };