const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Errores de validación', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateRegister = [
    body('correo').isEmail().withMessage('Correo inválido'),
    body('password').isLength({ min: 6 }).withMessage('Contraseña mínima 6 caracteres'),
    validate
];

const validateLogin = [
    body('correo').isEmail().withMessage('Correo inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
    validate
];

module.exports = { validateRegister, validateLogin, validate };