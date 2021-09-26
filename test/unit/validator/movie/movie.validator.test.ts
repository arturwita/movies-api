import each from "jest-each";
import { MovieValidator } from "../../../../src/validator";
import {
    invalidMovieInputCombinations,
    predefinedGenres,
    validMovieInputCombinations,
    validRequiredMovieInputProps,
} from "./test-payloads";
import { MovieInput } from "../../../../src/dto";
import { assertCustomError } from "../../../assert-custom-error";
import { Exception, ExceptionProps } from "../../../../src/error";

describe("Movie Validator", () => {
    let movieValidator: MovieValidator;
    let validateMock: jest.Mock;

    const logger = {
        error: jest.fn(),
    };

    const testMovieValidator = (movieInput: MovieInput): void => {
        validateMock(movieInput, predefinedGenres);
    };

    beforeEach(() => {
        // @ts-ignore
        movieValidator = new MovieValidator({ logger });
        validateMock = jest.fn(movieValidator.validate.bind(movieValidator));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    each(validMovieInputCombinations).it("Should return void if movie has a valid schema", movieInput => {
        // when
        testMovieValidator(movieInput);

        // then
        expect(validateMock).toHaveBeenCalledTimes(1);
        expect(validateMock).toHaveBeenCalledWith(movieInput, predefinedGenres);
    });

    each(invalidMovieInputCombinations).it(
        "Should throw error if the movie schema contains at least one invalid property",
        movieInput => {
            // given
            const expectedError: ExceptionProps = {
                message: "Invalid movie schema",
                status: 400,
                errorCode: "BAD_REQUEST",
            };

            try {
                // when
                testMovieValidator(movieInput);
            } catch (error) {
                // then
                expect(validateMock).toHaveBeenCalledTimes(1);
                expect(validateMock).toHaveBeenCalledWith(movieInput, predefinedGenres);
                assertCustomError(expectedError, error as Exception);
                return;
            }
            fail("Test should not reach here");
        }
    );

    it("Should throw error if provided genres are not defined in predefined genres", () => {
        // given
        const movieInput: MovieInput = {
            ...validRequiredMovieInputProps,
            genres: ["values", "not", "described", "in", "predefined", "genres"],
        };
        const expectedError: ExceptionProps = {
            message: "Provided genre is not recognised",
            status: 400,
            errorCode: "INVALID_INPUT_GENRE",
        };

        try {
            // when
            testMovieValidator(movieInput);
        } catch (error) {
            // then
            expect(validateMock).toHaveBeenCalledTimes(1);
            expect(validateMock).toHaveBeenCalledWith(movieInput, predefinedGenres);
            assertCustomError(expectedError, error as Exception);
            return;
        }
        fail("Test should not reach here");
    });
});
