import { Exception, ExceptionProps } from "../src/error";

export const assertCustomError = (expectedError: ExceptionProps, error: Exception): void => {
    expect(error.status).toBe(expectedError.status);
    expect(error.message).toBe(expectedError.message);
    expect(error.errorCode).toBe(expectedError.errorCode);
};
