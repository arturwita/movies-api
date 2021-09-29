import { ErrorHandlerMiddleware } from "../../../src/middleware";
import { Exception } from "../../../src/error";

describe("Error Handler Middleware", () => {
    let errorHandler: ErrorHandlerMiddleware;
    let handleErrorMock: jest.Mock;

    const logger = {
        error: jest.fn(),
    };

    const request = {};
    const responseSend = jest.fn();
    const response = {
        status: jest.fn(() => ({
            send: responseSend,
        })),
    };
    const next = {};

    const testMiddleware = (error: Exception): void => {
        handleErrorMock(error, request, response, next);
    };

    beforeEach(() => {
        // @ts-ignore
        errorHandler = new ErrorHandlerMiddleware({ logger });
        handleErrorMock = jest.fn(errorHandler.use.bind(errorHandler));
    });

    const runAssertions = (): void => {
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledTimes(1);
        expect(responseSend).toHaveBeenCalledTimes(1);
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should set response status and send payload with message, status and details", () => {
        // given
        const status = 400;
        const message = "Bad request";
        const errorCode = "BAD_REQUEST";
        const details = { payload: { a: 1 } };
        const error = new Exception(status, message, errorCode, details);

        // when
        testMiddleware(error);

        // then
        runAssertions();
        expect(logger.error).toHaveBeenCalledWith(message, error);
        expect(response.status).toHaveBeenCalledWith(status);
        expect(responseSend).toHaveBeenCalledWith({
            message: error.message,
            errorCode: error.errorCode,
            details: error.details,
        });
    });

    it("Should set custom error properties if they were not provided in thrown exception", () => {
        // given
        const status = 500;
        const message = "Internal server error";
        const errorCode = "INTERNAL_SERVER_ERROR";
        const details = null;
        const error = {} as Exception;
        const expectedError = new Exception(status, message, errorCode, details);

        // when
        testMiddleware(error);

        // then
        runAssertions();
        expect(logger.error).toHaveBeenCalledWith(expectedError.message, error);
        expect(response.status).toHaveBeenCalledWith(expectedError.status);
        expect(responseSend).toHaveBeenCalledWith({
            message: expectedError.message,
            errorCode: expectedError.errorCode,
            details: expectedError.details,
        });
    });

    it("Should set message to Internal server error if status >= 500 was thrown", () => {
        // given
        const status = 500;
        const message = "Custom error message";
        const errorCode = "INTERNAL_SERVER_ERROR";
        const error = new Exception(status, message, errorCode);
        const expectedMessage = "Internal server error";

        // when
        testMiddleware(error);

        // then
        runAssertions();
        expect(logger.error).toHaveBeenCalledWith(message, error);
        expect(response.status).toHaveBeenCalledWith(status);
        expect(responseSend).toHaveBeenCalledWith({
            message: expectedMessage,
            errorCode,
            details: null,
        });
    });
});
