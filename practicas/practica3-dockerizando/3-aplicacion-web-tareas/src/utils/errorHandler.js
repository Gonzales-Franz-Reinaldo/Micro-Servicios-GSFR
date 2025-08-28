// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Error interno del servidor');
};

module.exports = errorHandler;