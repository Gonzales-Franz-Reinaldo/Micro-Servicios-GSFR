import { DataSource } from 'typeorm';
import { LibroSchema } from '../entities/Libro.js';
import { PrestamoSchema } from '../entities/Prestamo.js';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [LibroSchema, PrestamoSchema],
});