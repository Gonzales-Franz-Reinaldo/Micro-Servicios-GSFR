require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');
const { connectDB } = require('./config/db');

const { startConsumer } = require('./services/rabbitmq_service');

// Conecta a DB 
connectDB();

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    logger.info(`Servidor de Envíos escuchando en el puerto ${PORT}`);
    
    // Iniciar el consumidor de RabbitMQ al levantar el servidor
    startConsumer(); 
});

module.exports = server;


