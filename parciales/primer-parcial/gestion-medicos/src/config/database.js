const { DataSource } = require('typeorm');
const Medico = require('../entities/Medico');

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Medico],
});

let isInitialized = false;

const initializeDatabase = async () => {
    if (!isInitialized) {
        try {
            await AppDataSource.initialize();
            console.log('Base de datos conectada exitosamente');
            isInitialized = true;
        } catch (error) {
            console.error('Error conectando a la base de datos:', error);
            setTimeout(initializeDatabase, 5000);
        }
    }
};

module.exports = { AppDataSource, initializeDatabase };