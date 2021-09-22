export class Exception extends Error {
    status: number;
    message: string;
    errorCode: string;
    details?: unknown;

    constructor(status: number, message: string, errorCode: string, details?: unknown) {
        super();
        Error.captureStackTrace(this, this.constructor);

        this.status = status;
        this.message = message;
        this.errorCode = errorCode;
        this.details = details;
    }
}
