const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        logger.info('Conectado a MongoDB exitosamente');
        console.log('Conectado a MongoDB exitosamente');
    } catch (error) {
        logger.error('Error al conectar a MongoDB:', error);
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;