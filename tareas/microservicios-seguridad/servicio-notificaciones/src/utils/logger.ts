import winston from 'winston';
import config from '../config/config';

const logger = winston.createLogger({
    level: config.logging.level,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            let log = `[${timestamp}] [${level.toUpperCase()}] [notificaciones]: ${message}`;
            if (stack) log += `\n${stack}`;
            return log;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message }) => 
                    `[${timestamp}] ${level}: ${message}`
                )
            ),
        }),
    ],
});

export default logger;