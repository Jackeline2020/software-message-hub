import * as DatadogWinston from 'datadog-winston';
import 'dotenv/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(
                    ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
                )
            ),
        }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/message-hub-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            level: 'info',
            format: winston.format.json(),
        }),
        new DatadogWinston({
            apiKey: process.env.DD_API_KEY,
            hostname: 'message-hub',
            service: 'message-hub',
            ddsource: 'nodejs',
            ddtags: 'env:dev',
        }),
    ],
});