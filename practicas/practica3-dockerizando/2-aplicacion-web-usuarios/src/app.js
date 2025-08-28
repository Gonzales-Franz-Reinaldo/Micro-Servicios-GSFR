import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { AppDataSource } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import  bodyParser  from "body-parser";
import expressEjsLayouts  from "express-ejs-layouts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configuración de EJS
app.use(expressEjsLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.set('layout', 'layouts/main');

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use("/", userRoutes);

// Inicializar TypeORM
AppDataSource.initialize()
    .then(() => {
        console.log("Conectado a MySQL con TypeORM");
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Error conectando a la DB:", err);
        process.exit(1);
    });
