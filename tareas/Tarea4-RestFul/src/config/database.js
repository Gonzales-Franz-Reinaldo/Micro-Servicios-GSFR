const { DataSource } = require("typeorm");
const { Cliente } = require("../entities/Cliente");
const { Producto } = require("../entities/Producto");
const { Factura } = require("../entities/Factura");
const { DetalleFactura } = require("../entities/DetalleFactura");

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [Cliente, Producto, Factura, DetalleFactura],
    charset: "utf8mb4",
    timezone: "Z",
});

const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("✅ Conexión a la base de datos establecida correctamente");
    } catch (error) {
        console.error("❌ Error al conectar con la base de datos:", error);
        process.exit(1);
    }
};

module.exports = { AppDataSource, connectDB };