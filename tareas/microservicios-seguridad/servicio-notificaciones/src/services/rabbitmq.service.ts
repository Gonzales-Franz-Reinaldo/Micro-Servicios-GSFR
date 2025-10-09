import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import config from '../config/config';
import logger from '../utils/logger';
import { MensajeCompra, DatosNotificacion } from '../models/notificacion.model';
import emailService from './email.service';
import usuariosClient from './usuarios.client';
import axios from 'axios';

class RabbitMQService {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    /**
     * Conecta a RabbitMQ
     */
    async conectar(): Promise<void> {
        try {
            logger.info('Conectando a RabbitMQ...');
            
            this.connection = await amqp.connect(config.rabbitmq.url);
            
            this.channel = await this.connection.createChannel();

            // Validar que el canal se creó correctamente
            if (!this.channel) {
                throw new Error('No se pudo crear el canal de RabbitMQ');
            }

            // Asegurar que la cola existe
            await this.channel.assertQueue(config.rabbitmq.queueName, {
                durable: true, // La cola persiste después de reiniciar RabbitMQ
            });

            logger.info(`Conectado a RabbitMQ - Cola: ${config.rabbitmq.queueName}`);

            this.connection.on('close', () => {
                logger.warn('Conexión a RabbitMQ cerrada. Reconectando en 5s...');
                this.connection = null;
                this.channel = null;
                setTimeout(() => this.conectar(), 5000);
            });

            this.connection.on('error', (err: Error) => {
                logger.error(`Error en conexión RabbitMQ: ${err.message}`);
            });
        } catch (error: any) {
            logger.error(`Error al conectar a RabbitMQ: ${error.message}`);
            this.connection = null;
            this.channel = null;
            setTimeout(() => this.conectar(), 5000);
        }
    }

    /**
     * Escucha mensajes de la cola
     */
    async consumirMensajes(): Promise<void> {
        // Validar que el canal existe
        if (!this.channel) {
            throw new Error('Canal de RabbitMQ no está disponible');
        }

        logger.info(`Escuchando mensajes en cola: ${config.rabbitmq.queueName}`);

        // Configurar prefetch (procesar 1 mensaje a la vez)
        await this.channel.prefetch(1);

        await this.channel.consume(
            config.rabbitmq.queueName,
            async (msg: ConsumeMessage | null) => {
                if (msg) {
                    await this.procesarMensaje(msg.content.toString());
                    
                    // Validar que el canal sigue activo antes de hacer ack
                    if (this.channel) {
                        this.channel.ack(msg);
                    }
                }
            },
            { noAck: false } // Requerir confirmación manual
        );
    }

    /**
     * Procesa un mensaje de compra
     */
    private async procesarMensaje(contenido: string): Promise<void> {
        try {
            logger.info(`Mensaje recibido: ${contenido}`);

            const mensaje: MensajeCompra = JSON.parse(contenido);

            // 1. Obtener datos del usuario
            const usuario = await usuariosClient.getUsuario(mensaje.usuarioId);
            if (!usuario) {
                logger.error(`Usuario ${mensaje.usuarioId} no encontrado`);
                return;
            }

            // 2. Obtener datos del evento
            const eventoResponse = await axios.get(
                `${config.services.eventos}/eventos/${mensaje.eventoId}`,
                { timeout: 5000 }
            );
            const evento = eventoResponse.data;

            // 3. Preparar datos completos
            const datosNotificacion: DatosNotificacion = {
                usuario,
                evento,
                compra: {
                    id: mensaje.compraId,
                    cantidad: mensaje.cantidad,
                    total: mensaje.total,
                    metodoPago: mensaje.metodoPago,
                    fechaPago: mensaje.fechaPago,
                },
            };

            // 4. Enviar email
            const enviado = await emailService.enviarConfirmacionPago(datosNotificacion);

            if (enviado) {
                logger.info(`Notificación enviada exitosamente para compra #${mensaje.compraId}`);
            } else {
                logger.error(`Fallo al enviar notificación para compra #${mensaje.compraId}`);
            }
        } catch (error: any) {
            logger.error(`Error al procesar mensaje: ${error.message}`);
        }
    }

    /**
     * Cierra la conexión
     */
    async cerrar(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            
            if (this.connection) {
                await this.connection.close();
            }
            
            logger.info('Conexión a RabbitMQ cerrada');
        } catch (error: any) {
            logger.error(`Error al cerrar conexión: ${error.message}`);
        } finally {
            this.connection = null;
            this.channel = null;
        }
    }
}

export default new RabbitMQService();