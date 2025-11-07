const amqp = require('amqplib');
const logger = require('../config/logger'); 

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'notificacion_envios';


// const EnviosService = require('./envios_client'); 

async function startConsumer() {
    let connection;
    try {
        logger.info(`Intentando conectar a RabbitMQ en ${RABBITMQ_URL}...`);
        connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Declarar la cola 
        await channel.assertQueue(QUEUE_NAME, {
            durable: true
        });
        
        // Limitar el procesamiento a un mensaje a la vez 
        channel.prefetch(1); 
        

        // Iniciar el consumidor
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg === null) return;
            
            const content = msg.content.toString();
            
            try {
                const data = JSON.parse(content);
                logger.info(`[MSG] Recibido para Envío ID: ${data.envio_id}. Nuevo estado: ${data.status}`);
                
                
                // await EnviosService.updateEnvioStatus(data.envio_id, data.status, data.mensaje); 
                
                
                // Confirmar el mensaje después del procesamiento
                channel.ack(msg);
                logger.info(`[ACK] Mensaje para Envío ID ${data.envio_id} procesado correctamente.`);

            } catch (error) {
                logger.error(`[ERROR] Fallo al procesar mensaje de RabbitMQ: ${error.message}. Contenido: ${content}`);
                // channel.nack(msg); 
            }
        }, {
            noAck: false 
        });

    } catch (error) {
        logger.error(`[FATAL] No se pudo conectar a RabbitMQ: ${error.message}. Intentando reconectar en 5s...`);
        setTimeout(startConsumer, 5000); 
    }
}

module.exports = { startConsumer };