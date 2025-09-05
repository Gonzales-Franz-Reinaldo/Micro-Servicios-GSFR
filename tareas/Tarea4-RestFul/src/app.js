require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { connectDB } = require("./config/database");
const swaggerSpec = require("./config/swagger");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || "/api";
const API_VERSION = process.env.API_VERSION || "v1";

// Middlewares globales
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de logging en desarrollo
if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
        next();
    });
}

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 API Sistema de Ventas - Servidor funcionando correctamente",
        data: {
            version: "1.0.0",
            environment: process.env.NODE_ENV || "development",
            timestamp: new Date().toISOString(),
            endpoints: {
                api: `${API_PREFIX}/${API_VERSION}`,
                documentation: "/api-docs",
                health: "/health"
            }
        }
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API funcionando correctamente",
        data: {
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
        }
    });
});

// Documentación de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Sistema de Ventas - Documentación",
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
    }
}));

// Rutas de la API
app.use(`${API_PREFIX}/${API_VERSION}`, routes);

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint no encontrado",
        error: `La ruta ${req.originalUrl} no existe`,
        data: {
            availableEndpoints: {
                api: `${API_PREFIX}/${API_VERSION}`,
                documentation: "/api-docs",
                health: "/health"
            }
        }
    });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Conectar a la base de datos
        await connectDB();

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log("\n" + "=".repeat(50));
            console.log("SERVIDOR INICIADO CORRECTAMENTE");
            console.log("=".repeat(50));
            console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
            console.log(`Servidor: http://localhost:${PORT}`);
            console.log(`API: http://localhost:${PORT}${API_PREFIX}/${API_VERSION}`);
            console.log(`Documentación: http://localhost:${PORT}/api-docs`);
            console.log(`Health Check: http://localhost:${PORT}/health`);
            console.log("=".repeat(50));

            if (process.env.NODE_ENV === "development") {
                console.log("\n ENDPOINTS DISPONIBLES:");
                console.log(`   GET    ${API_PREFIX}/${API_VERSION}/clientes`);
                console.log(`   POST   ${API_PREFIX}/${API_VERSION}/clientes`);
                console.log(`   GET    ${API_PREFIX}/${API_VERSION}/productos`);
                console.log(`   POST   ${API_PREFIX}/${API_VERSION}/productos`);
                console.log(`   GET    ${API_PREFIX}/${API_VERSION}/facturas`);
                console.log(`   POST   ${API_PREFIX}/${API_VERSION}/facturas`);
                console.log(`   POST   ${API_PREFIX}/${API_VERSION}/facturas/:id/detalles`);
                console.log("\n Tip: Visita /api-docs para ver la documentación completa\n");
            }
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

// Manejo de errores no capturados
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

// Manejo elegante del cierre del servidor
process.on("SIGTERM", () => {
    console.log("\nCerrando servidor...");
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("\nCerrando servidor...");
    process.exit(0);
});

// Iniciar el servidor
if (require.main === module) {
    startServer();
}

module.exports = app;