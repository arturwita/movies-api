import { createLogger, transports, format, Logger as WinstonLogger } from "winston";
import config from "config";

enum LOG_LEVEL {
    INFO = "info",
    DEBUG = "debug",
    ERROR = "error",
}

export class Logger {
    private readonly logger: WinstonLogger;

    constructor() {
        this.logger = createLogger({
            transports: new transports.Console({
                level: config.get("app.logLevel"),
            }),
            format: format.json(),
        });
    }

    private log(level: LOG_LEVEL, message: string, payload?: unknown): void {
        this.logger.log({ level, message, payload });
    }

    info(msg: string, payload?: unknown): void {
        this.log(LOG_LEVEL.INFO, msg, payload);
    }

    debug(msg: string, payload?: unknown): void {
        this.log(LOG_LEVEL.DEBUG, msg, payload);
    }

    error(msg: string, payload?: unknown): void {
        this.log(LOG_LEVEL.ERROR, msg, payload);
    }
}
