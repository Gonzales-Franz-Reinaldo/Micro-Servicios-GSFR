const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Error de validación de Joi
    if (err.isJoi) {
        return res.status(400).json({
            success: false,
            message: "Error de validación",
            errors: err.details.map(detail => detail.message),
        });
    }

    // Error de TypeORM
    if (err.name === "QueryFailedError") {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "El registro ya existe",
                error: "Conflicto de datos únicos",
            });
        }
    }

    // Error personalizado
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err.error || "Error del servidor",
        });
    }

    // Error genérico
    res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? err.message : "Error interno",
    });
};

module.exports = errorHandler;