require('dotenv').config();
const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE = process.env.QUEUE_NAME || 'email_queue';

async function simulateEmailSending(user) {
    // Aquí simulas la lógica de envío de correo.
    console.log(`Simulando envío de correo a: ${user.email} (nombre: ${user.name})`);
    // Simula latencia de envío
    await new Promise(r => setTimeout(r, 1500));
    console.log(`Correo "enviado" a ${user.email} (simulado)`);
}

// Función para esperar conexión con reintentos
async function connectWithRetry(maxRetries = 10, delayMs = 5000) {
    for (let i = 1; i <= maxRetries; i++) {
        try {
            console.log(` Intento ${i}/${maxRetries} de conexión a RabbitMQ...`);
            const conn = await amqp.connect(RABBITMQ_URL);
            console.log('Conectado a RabbitMQ exitosamente');
            return conn;
        } catch (err) {
            console.error(` Error en intento ${i}/${maxRetries}:`, err.message);
            if (i === maxRetries) {
                throw new Error(`No se pudo conectar a RabbitMQ después de ${maxRetries} intentos`);
            }
            console.log(` Esperando ${delayMs}ms antes del siguiente intento...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
}

async function startConsumer() {
    try {
        const conn = await connectWithRetry();
        const channel = await conn.createChannel();
        await channel.assertQueue(QUEUE, { durable: true });
        
        // Recomiendo prefetch(1) para distribuir carga entre consumidores
        channel.prefetch(1);
        console.log(' Esperando mensajes en la cola:', QUEUE);
        
        channel.consume(QUEUE, async (msg) => {
            if (msg !== null) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    console.log('Mensaje recibido:', content);
                    
                    if (content.type === 'NEW_USER' && content.user) {
                        await simulateEmailSending(content.user);
                        // ack (confirmamos que procesamos bien)
                        channel.ack(msg);
                    } else {
                        console.log(' Mensaje con tipo desconocido, ack y descartar');
                        channel.ack(msg);
                    }
                } catch (err) {
                    console.error(' Error procesando mensaje:', err);
                    // si ocurre error se puede requeue o enviar a DLX; aquí requeue=false para no bloquear
                    channel.nack(msg, false, false);
                }
            }
        }, { noAck: false });

        // Manejar cierre de conexión
        conn.on('close', () => {
            console.error(' Conexión cerrada, intentando reconectar...');
            setTimeout(startConsumer, 5000);
        });

        conn.on('error', (err) => {
            console.error(' Error en conexión:', err.message);
        });

    } catch (err) {
        console.error(' Error en consumer', err);
        process.exit(1);
    }
}

startConsumer();