const Joi = require("joi");

const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                errors: error.details.map(detail => detail.message),
            });
        }
        next();
    };
};

const clienteSchema = Joi.object({
    ci: Joi.string().min(7).max(15).required().messages({
        'string.min': 'CI debe tener al menos 7 caracteres',
        'string.max': 'CI no puede tener más de 15 caracteres',
        'any.required': 'CI es requerido',
    }),
    nombres: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Nombres debe tener al menos 2 caracteres',
        'string.max': 'Nombres no puede tener más de 100 caracteres',
        'any.required': 'Nombres es requerido',
    }),
    apellidos: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Apellidos debe tener al menos 2 caracteres',
        'string.max': 'Apellidos no puede tener más de 100 caracteres',
        'any.required': 'Apellidos es requerido',
    }),
    sexo: Joi.string().valid('M', 'F').required().messages({
        'any.only': 'Sexo debe ser M o F',
        'any.required': 'Sexo es requerido',
    }),
});

const productoSchema = Joi.object({
    nombre: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Nombre debe tener al menos 2 caracteres',
        'string.max': 'Nombre no puede tener más de 100 caracteres',
        'any.required': 'Nombre es requerido',
    }),
    descripcion: Joi.string().allow('', null).optional(),
    marca: Joi.string().min(1).max(50).required().messages({
        'string.min': 'Marca debe tener al menos 1 caracter',
        'string.max': 'Marca no puede tener más de 50 caracteres',
        'any.required': 'Marca es requerida',
    }),
    stock: Joi.number().integer().min(0).default(0),
    precio: Joi.number().positive().required().messages({
        'number.positive': 'Precio debe ser un número positivo',
        'any.required': 'Precio es requerido',
    }),
});

const facturaSchema = Joi.object({
    fecha: Joi.date().required().messages({
        'date.base': 'Fecha debe ser una fecha válida',
        'any.required': 'Fecha es requerida',
    }),
    cliente_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Cliente ID debe ser un número',
        'number.positive': 'Cliente ID debe ser positivo',
        'any.required': 'Cliente ID es requerido',
    }),
});

const detalleFacturaSchema = Joi.object({
    producto_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Producto ID debe ser un número',
        'number.positive': 'Producto ID debe ser positivo',
        'any.required': 'Producto ID es requerido',
    }),
    cantidad: Joi.number().integer().positive().required().messages({
        'number.base': 'Cantidad debe ser un número',
        'number.positive': 'Cantidad debe ser positiva',
        'any.required': 'Cantidad es requerida',
    }),
    precio_unitario: Joi.number().positive().required().messages({
        'number.positive': 'Precio unitario debe ser un número positivo',
        'any.required': 'Precio unitario es requerido',
    }),
});

module.exports = {
    validateSchema,
    clienteSchema,
    productoSchema,
    facturaSchema,
    detalleFacturaSchema,
};
