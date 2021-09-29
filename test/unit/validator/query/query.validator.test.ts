// import each from "jest-each";
import { QueryValidator } from "../../../../src/validator";
import { ParsedQuery, QueryParams } from "../../../../src/dto";
import { assertCustomError } from "../../../assert-custom-error";
import { Exception, ExceptionProps } from "../../../../src/error";
import { predefinedGenres } from "./test-payloads";

describe("Query Validator", () => {
    let queryValidator: QueryValidator;
    let validateMock: jest.Mock;

    const logger = {
        error: jest.fn(),
    };

    const testQueryValidator = (parsedQuery: QueryParams): ParsedQuery => validateMock(parsedQuery, predefinedGenres);

    beforeEach(() => {
        // @ts-ignore
        queryValidator = new QueryValidator({ logger });
        validateMock = jest.fn(queryValidator.validate.bind(queryValidator));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should parse request query params", () => {
        // given
        const query: QueryParams = {
            duration: "60",
            genres: `["Biography", "Drama"]`,
        };
        const expectedResult: ParsedQuery = {
            duration: 60,
            genres: ["Biography", "Drama"],
        };

        // when
        const parsedQuery = testQueryValidator(query);

        // then
        expect(parsedQuery).toEqual(expectedResult);
    });

    it("Should return null for params which were not provided", () => {
        // given
        const query: QueryParams = {};
        const expectedResult: ParsedQuery = {
            duration: null,
            genres: null,
        };

        // when
        const parsedQuery = testQueryValidator(query);

        // then
        expect(parsedQuery).toEqual(expectedResult);
    });

    it("Should throw error if duration was not parsed to a number", () => {
        // given
        const query: QueryParams = {
            duration: "not a number",
        };
        const expectedError: ExceptionProps = {
            message: "Could not parse duration to number",
            status: 400,
            errorCode: "BAD_REQUEST",
        };

        try {
            // when
            testQueryValidator(query);
        } catch (error) {
            // then
            expect(validateMock).toHaveBeenCalledTimes(1);
            expect(validateMock).toHaveBeenCalledWith(query, predefinedGenres);
            assertCustomError(expectedError, error as Exception);
            return;
        }
        fail("Test should not reach here");
    });

    it("Should throw error if genres was not parsed to an array", () => {
        // given
        const query: QueryParams = {
            genres: `{ "not": "an array" }`,
        };
        const expectedError: ExceptionProps = {
            message: "Genres should be an array",
            status: 400,
            errorCode: "BAD_REQUEST",
        };

        try {
            // when
            testQueryValidator(query);
        } catch (error) {
            // then
            expect(validateMock).toHaveBeenCalledTimes(1);
            expect(validateMock).toHaveBeenCalledWith(query, predefinedGenres);
            assertCustomError(expectedError, error as Exception);
            return;
        }
        fail("Test should not reach here");
    });

    it("Should throw error if genres could not be parsed", () => {
        // given
        const query: QueryParams = {
            genres: "not an array",
        };
        const expectedError: ExceptionProps = {
            message: "Could not parse genres to an array",
            status: 400,
            errorCode: "BAD_REQUEST",
        };

        try {
            // when
            testQueryValidator(query);
        } catch (error) {
            // then
            expect(validateMock).toHaveBeenCalledTimes(1);
            expect(validateMock).toHaveBeenCalledWith(query, predefinedGenres);
            assertCustomError(expectedError, error as Exception);
            return;
        }
        fail("Test should not reach here");
    });

    it("Should throw error if provided genres are not defined in predefined genres", () => {
        // given
        const expectedError: ExceptionProps = {
            message: "Genres contain values outside the predefined genres",
            status: 400,
            errorCode: "BAD_REQUEST",
        };
        const query: QueryParams = {
            genres: `["values", "not", "described", "in", "predefined", "genres"]`,
        };

        try {
            // when
            testQueryValidator(query);
        } catch (error) {
            // then
            expect(validateMock).toHaveBeenCalledTimes(1);
            expect(validateMock).toHaveBeenCalledWith(query, predefinedGenres);
            assertCustomError(expectedError, error as Exception);
            return;
        }
        fail("Test should not reach here");
    });
});
