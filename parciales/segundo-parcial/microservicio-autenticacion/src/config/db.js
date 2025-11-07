const { Sequelize } = require('sequelize');
const logger = require('./logger');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: (msg) => logger.info(msg),
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Conectado a MySQL exitosamente');
        console.log('Conectado a MySQL exitosamente');
        
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            logger.info('Modelos sincronizados con la base de datos');
        }
    } catch (error) {
        logger.error('Error al conectar a MySQL:', error);
        console.error('Error al conectar a MySQL:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };