import pino from "pino";

/**
 * Logger minimaliste (prod-ready)
 * ➜ Enregistre uniquement les erreurs (`error` et +)
 * ➜ JSON compact en production (Vercel)
 * ➜ Lisible et coloré en dev
 */

const isProd = process.env.NODE_ENV === "production";

const logger = pino({
    level: "error",
    base: { env: process.env.NODE_ENV },
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: !isProd
        ? {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "yyyy-mm-dd HH:MM:ss",
                ignore: "pid,hostname",
            },
        }
        : undefined, // prod = JSON brut
});

export default logger;
