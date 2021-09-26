import each from "jest-each";
import { QueryValidator } from "../../../../src/validator";
import { ParsedQuery } from "../../../../src/dto";
import { assertCustomError } from "../../../assert-custom-error";
import { Exception, ExceptionProps } from "../../../../src/error";
import { predefinedGenres, validParsedQuery } from "./test-payloads";

describe("Query Validator", () => {
    let queryValidator: QueryValidator;
    let validateMock: jest.Mock;

    const logger = {
        error: jest.fn(),
    };

    const testQueryValidator = (parsedQuery: ParsedQuery): void => {
        validateMock(parsedQuery, predefinedGenres);
    };

    beforeEach(() => {
        // @ts-ignore
        queryValidator = new QueryValidator({ logger });
        validateMock = jest.fn(queryValidator.validate.bind(queryValidator));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    each(validParsedQuery).it("Should return void if query has a valid schema", query => {
        // when
        testQueryValidator(query);

        // then
        expect(validateMock).toHaveBeenCalledTimes(1);
        expect(validateMock).toHaveBeenCalledWith(query, predefinedGenres);
    });

    it("Should throw error if duration was not parsed to a number", () => {
        // given
        const query = {
            duration: NaN,
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
        const query: ParsedQuery = {
            // @ts-ignore
            genres: "not an array",
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

    it("Should throw error if provided genres are not defined in predefined genres", () => {
        // given
        const expectedError: ExceptionProps = {
            message: "Genres contain values outside the predefined genres",
            status: 400,
            errorCode: "BAD_REQUEST",
        };
        const query: ParsedQuery = {
            genres: ["values", "not", "described", "in", "predefined", "genres"],
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
