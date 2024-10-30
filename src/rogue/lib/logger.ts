import pino from 'pino'

enum LogLevel {
    NONE,
    ERROR,
    WARN,
    INFO,
    DEBUG,
}

const pinoLogger = pino({
    level: 'debug',
})

class EventLogger {
    static logLevel: LogLevel = LogLevel.DEBUG

    static debug(event: object, ...optionalParams: any[]): void {
        if (EventLogger.logLevel >= LogLevel.DEBUG) {
            pinoLogger.debug(
                { eventType: event.constructor.name, ...event },
                ...optionalParams
            )
        }
    }
}

class Logger {
    static logLevel: LogLevel = LogLevel.DEBUG

    static debug(
        messageOrObject: string | object,
        ...optionalParams: any[]
    ): void {
        if (Logger.logLevel >= LogLevel.DEBUG) {
            if (typeof messageOrObject === 'string') {
                pinoLogger.debug(messageOrObject)
            } else {
                pinoLogger.debug(messageOrObject, ...optionalParams)
            }
        }
    }

    static info(
        messageOrObject: string | object,
        ...optionalParams: any[]
    ): void {
        if (Logger.logLevel >= LogLevel.INFO) {
            if (typeof messageOrObject === 'string') {
                pinoLogger.info({ optionalParams }, messageOrObject)
            } else {
                pinoLogger.info(messageOrObject, ...optionalParams)
            }
        }
    }

    static warn(
        messageOrObject: string | object,
        ...optionalParams: any[]
    ): void {
        if (Logger.logLevel >= LogLevel.WARN) {
            if (typeof messageOrObject === 'string') {
                pinoLogger.warn({ optionalParams }, messageOrObject)
            } else {
                pinoLogger.warn(messageOrObject, ...optionalParams)
            }
        }
    }

    static error(
        messageOrObject: string | object,
        ...optionalParams: any[]
    ): void {
        if (Logger.logLevel >= LogLevel.ERROR) {
            if (typeof messageOrObject === 'string') {
                pinoLogger.error({ optionalParams }, messageOrObject)
            } else {
                pinoLogger.error(messageOrObject, ...optionalParams)
            }
        }
    }
}

export { Logger, LogLevel, EventLogger }
