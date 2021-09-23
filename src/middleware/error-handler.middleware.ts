import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { Exception } from "../error/exception";
import { HTTP_ERROR_CODE } from "../error/error-codes";
import { AppDependencies } from "../dependency-injection/container";
import { Logger } from "../util";

export class ErrorHandlerMiddleware {
    logger: Logger;

    constructor({ logger }: AppDependencies) {
        this.logger = logger;
    }

    use(error: Exception, _req: Request, res: Response, _next: NextFunction): void {
        this.logger.error(error.message, error);

        const status = get(error, "status", 500);
        const errorCode = get(error, "errorCode", HTTP_ERROR_CODE.INTERNAL_SERVER_ERROR);
        const details = get(error, "details", null);
        const message = status >= 500 ? "Internal server error" : error.message;

        res.status(status).send({
            message,
            errorCode,
            details,
        });
    }
}
