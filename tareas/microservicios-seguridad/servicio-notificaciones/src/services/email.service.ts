import nodemailer, { Transporter } from 'nodemailer';
import config from '../config/config';
import logger from '../utils/logger';
import { DatosNotificacion } from '../models/notificacion.model';
import { generarEmailConfirmacion } from '../templates/email.template';

class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            secure: config.email.secure, 
            auth: {
                user: config.email.user,
                pass: config.email.pass,
            },
        });
    }

    /**
     * Verifica la conexión con el servidor SMTP
     */
    async verificarConexion(): Promise<boolean> {
        try {
            await this.transporter.verify();
            logger.info('Conexión con servidor SMTP verificada');
            return true;
        } catch (error: any) {
            logger.error(`Error al conectar con servidor SMTP: ${error.message}`);
            return false;
        }
    }

    /**
     *  Envía email de confirmación de pago (SOLO TEXTO PLANO)
     */
    async enviarConfirmacionPago(datos: DatosNotificacion): Promise<boolean> {
        try {
            const { usuario, compra } = datos;

            const contenidoEmail = generarEmailConfirmacion(datos);

            const mailOptions = {
                from: `"Sistema de Entradas" <${config.email.user}>`,
                to: usuario.email,
                subject: `Confirmación de Pago - Compra #${String(compra.id).padStart(6, '0')}`,
                text: contenidoEmail, 
            };

            const info = await this.transporter.sendMail(mailOptions);

            logger.info(`📧 Email enviado a ${usuario.email} - MessageID: ${info.messageId}`);
            return true;
        } catch (error: any) {
            logger.error(`Error al enviar email: ${error.message}`);
            return false;
        }
    }
}

export default new EmailService();