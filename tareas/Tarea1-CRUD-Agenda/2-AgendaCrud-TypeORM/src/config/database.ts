import { createConnection, Connection } from 'typeorm';
import { Agenda } from '../entities/Agenda';
import 'dotenv/config';

async function initializeDatabase(): Promise<Connection> {
    try {
        const connection = await createConnection({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [Agenda],
            synchronize: false, // Cambiar a true en desarrollo
            logging: false // Cambiar a true para depuración
        });

        console.log('Conexión a la base de datos establecida');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
}

export default initializeDatabase;