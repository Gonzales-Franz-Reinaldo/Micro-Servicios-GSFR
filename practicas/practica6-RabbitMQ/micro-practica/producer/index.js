require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE = process.env.QUEUE_NAME || 'email_queue';
const PORT = process.env.PORT || 3000;

let channel;

// Función para conectar con reintentos
async function connectWithRetry(maxRetries = 10, delayMs = 5000) {
    for (let i = 1; i <= maxRetries; i++) {
        try {
            console.log(`Intento ${i}/${maxRetries} de conexión a RabbitMQ...`);
            const conn = await amqp.connect(RABBITMQ_URL);
            console.log('Conectado a RabbitMQ exitosamente');
            return conn;
        } catch (err) {
            console.error(`Error en intento ${i}/${maxRetries}:`, err.message);
            if (i === maxRetries) {
                throw new Error(`No se pudo conectar a RabbitMQ después de ${maxRetries} intentos`);
            }
            console.log(`Esperando ${delayMs}ms antes del siguiente intento...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
}

async function initRabbit() {
    try {
        const conn = await connectWithRetry();
        channel = await conn.createChannel();
        await channel.assertQueue(QUEUE, { durable: true });
        console.log('Cola asegurada:', QUEUE);
        
        // Cerrar conexión al terminar el proceso
        process.on('SIGINT', async () => {
            console.log('\n Cerrando conexión a RabbitMQ...');
            try {
                await channel.close(); 
                await conn.close(); 
            } catch (e) { 
                console.error('Error cerrando conexión:', e.message);
            }
            process.exit(0);
        });

        // Manejar reconexión
        conn.on('close', () => {
            console.error('Conexión cerrada, intentando reconectar...');
            setTimeout(initRabbit, 5000);
        });

        conn.on('error', (err) => {
            console.error('Error en conexión:', err.message);
        });

    } catch (err) {
        console.error('Error conectando a RabbitMQ', err);
        process.exit(1);
    }
}

async function startServer() {
    await initRabbit();
    
    const app = express();
    app.use(bodyParser.json());
    
    // Almacenamiento en memoria (sólo para demo)
    const users = [];
    
    // Endpoint de registro
    app.post('/register', async (req, res) => {
        const { name, email, cell } = req.body;
        
        if (!name || !email || !cell) {
            return res.status(400).json({ 
                error: 'Faltan campos: name, email, cell' 
            });
        }
        
        const user = {
            id: Date.now(),
            name,
            email,
            cell,
            createdAt: new Date().toISOString()
        };
        
        users.push(user);
        
        const payload = { type: 'NEW_USER', user };
        
        try {
            if (!channel) {
                throw new Error('Canal de RabbitMQ no disponible');
            }

            const sent = channel.sendToQueue(
                QUEUE,
                Buffer.from(JSON.stringify(payload)), 
                { persistent: true }
            );
            
            console.log('Mensaje enviado a la cola:', payload);
            return res.status(201).json({ ok: true, user });
            
        } catch (err) {
            console.error('Error publicando en la cola', err);
            return res.status(500).json({ 
                error: 'No se pudo enviar a la cola',
                details: err.message 
            });
        }
    });
    
    app.get('/users', (req, res) => res.json(users));

    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            rabbitmq: channel ? 'connected' : 'disconnected',
            users: users.length
        });
    });
    
    app.listen(PORT, () => {
        console.log(`Producer API en http://localhost:${PORT}`);
        console.log(` Health check: http://localhost:${PORT}/health`);
    });
}

startServer().catch(err => {
    console.error('Fallo al iniciar producer', err);
    process.exit(1);
});