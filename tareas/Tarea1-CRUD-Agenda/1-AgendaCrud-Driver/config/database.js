const mysql = require('mysql2/promise');
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true, // Esperar conexiones pendientes
    connectionLimit: 10, // Límite de conexiones en el pool
    queueLimit: 0 // Sin límite en la cola de conexiones
});


pool.getConnection()
    .then(connection => {
        console.log('Conexión a la base de datos exitosa');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

module.exports = pool;