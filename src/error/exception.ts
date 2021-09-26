export interface ExceptionProps {
    message: string;
    status: number;
    errorCode: string;
}

export class Exception extends Error implements ExceptionProps {
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
