import { Request, Response, NextFunction } from "express";
import { Logger } from "../util/logger";
import { ContainerDependencies } from "../dependency-injection/container";

export class LoggerMiddleware {
    private readonly logger: Logger;

    constructor({ logger }: ContainerDependencies) {
        this.logger = logger;
    }

    use(request: Request, _response: Response, next: NextFunction): void {
        const { method, path, body, params, query } = request;
        const timestamp = new Date();

        this.logger.debug(`Incoming request`, { method, path, timestamp, body, params, query });

        next();
    }
}
