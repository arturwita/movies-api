import { LoggerMiddleware } from "../../../src/middleware";

describe("Logger Middleware", () => {
    let loggerMiddleware: LoggerMiddleware;
    let useMiddlewareMock: jest.Mock;

    const logger = {
        debug: jest.fn(),
    };

    const request = {
        method: "GET",
        path: "url",
        body: { a: 1 },
        params: { b: 2 },
        query: { c: 3 },
    };
    const response = {};
    const next = jest.fn();

    const testMiddleware = (): void => {
        useMiddlewareMock(request, response, next);
    };

    beforeEach(() => {
        // @ts-ignore
        loggerMiddleware = new LoggerMiddleware({ logger });
        useMiddlewareMock = jest.fn(loggerMiddleware.use.bind(loggerMiddleware));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should log incoming message with given params", () => {
        // when
        testMiddleware();

        // then
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenCalledWith("Incoming request", expect.objectContaining(request));
    });
});
