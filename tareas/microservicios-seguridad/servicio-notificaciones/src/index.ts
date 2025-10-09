import logger from './utils/logger';
import rabbitmqService from './services/rabbitmq.service';
import emailService from './services/email.service';

async function iniciar() {
    logger.info('Iniciando Servicio de Notificaciones...');

    // 1. Verificar conexión SMTP
    const smtpOk = await emailService.verificarConexion();
    if (!smtpOk) {
        logger.error('No se pudo conectar al servidor SMTP. Verifica la configuración.');
        process.exit(1);
    }

    // 2. Conectar a RabbitMQ
    await rabbitmqService.conectar();

    // 3. Empezar a consumir mensajes
    await rabbitmqService.consumirMensajes();

    logger.info('Servicio de Notificaciones listo y escuchando mensajes');
}

// Manejar cierre graceful
process.on('SIGINT', async () => {
    logger.info('\nCerrando servicio de notificaciones...');
    await rabbitmqService.cerrar();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('\nCerrando servicio de notificaciones...');
    await rabbitmqService.cerrar();
    process.exit(0);
});

// Iniciar servicio
iniciar().catch((error) => {
    logger.error(`Error fatal: ${error.message}`);
    process.exit(1);
});