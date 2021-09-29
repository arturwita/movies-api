import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { HTTP_ERROR_CODE, Exception } from "../error";
import { AppDependencies } from "../dependency-injection";
import { Logger } from "../util";

export class ErrorHandlerMiddleware {
    logger: Logger;

    constructor({ logger }: AppDependencies) {
        this.logger = logger;
    }

    use(error: Exception, _req: Request, res: Response, _next: NextFunction): void {
        const defaultMessage = "Internal server error";
        const errorMessage = get(error, "message", defaultMessage);

        const status = get(error, "status", 500);
        const errorCode = get(error, "errorCode", HTTP_ERROR_CODE.INTERNAL_SERVER_ERROR);
        const details = get(error, "details", null);
        const message = status >= 500 ? defaultMessage : errorMessage;

        this.logger.error(errorMessage, error);

        res.status(status).send({
            message,
            errorCode,
            details,
        });
    }
}
