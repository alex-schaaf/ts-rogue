enum LogLevel {
    NONE,
    ERROR,
    WARN,
    INFO,
    DEBUG,
}

class Logger {
    static logLevel: LogLevel = LogLevel.DEBUG

    static debug(message: string, ...optionalParams: any[]): void {
        if (Logger.logLevel >= LogLevel.DEBUG) {
            console.debug(message, ...optionalParams)
        }
    }

    static info(message: string, ...optionalParams: any[]): void {
        if (Logger.logLevel >= LogLevel.INFO) {
            console.info(message, ...optionalParams)
        }
    }

    static warn(message: string, ...optionalParams: any[]): void {
        if (Logger.logLevel >= LogLevel.WARN) {
            console.warn(message, ...optionalParams)
        }
    }

    static error(message: string, ...optionalParams: any[]): void {
        if (Logger.logLevel >= LogLevel.ERROR) {
            console.error(message, ...optionalParams)
        }
    }
}

export { Logger, LogLevel }
