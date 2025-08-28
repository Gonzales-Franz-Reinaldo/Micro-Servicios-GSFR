import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME,
    synchronize: true, // Solo para desarrollo
    entities: [User],
    logging: false,
});