import each from "jest-each";
import { addToDb, clearDb, readDb, sendPostRequest, ApiError } from "./util";
import { defaultMovie, defaultMovieInput } from "./test-payloads";
import { Movie, MovieInput } from "../../src/dto";
import { invalidMovieInputCombinations, validRequiredMovieInputProps } from "../unit/validator/movie/test-payloads";

describe("POST /movies", () => {
    beforeEach(() => {
        clearDb();
    });

    afterAll(() => {
        clearDb();
    });

    it("Should add new movie to db if it did not exist before", async () => {
        const savedMovie: Movie = {
            id: 1,
            ...defaultMovieInput,
        };

        // when
        // @ts-ignore
        const { body, statusCode } = await sendPostRequest(defaultMovieInput);

        // then
        expect(statusCode).toBe(201);
        expect(body).toEqual({
            movie: savedMovie,
        });

        const { movies: savedMovies } = readDb();
        expect(savedMovies.length).toBe(1);
        expect(savedMovies[0]).toEqual(savedMovie);
    });

    it("Should throw error if user tries to add a movie that already exists in db", async () => {
        // given
        addToDb(defaultMovie);
        const {
            movies: [savedMovie],
        } = readDb();
        expect(savedMovie).toEqual(defaultMovie);

        try {
            // when
            await sendPostRequest(defaultMovieInput);
        } catch (err) {
            const error = err as ApiError;
            // then
            expect(error.response.statusCode).toBe(400);
            expect(error.response.body.message).toBe("Given movie already exists");
            expect(error.response.body.errorCode).toBe("MOVIE_ALREADY_EXISTS");
            return;
        }

        fail("Test should not reach here");
    });

    each(invalidMovieInputCombinations).it(
        "Should throw error if user tries to add a movie with invalid schema",
        async movieInputCombination => {
            try {
                // when
                await sendPostRequest(movieInputCombination);
            } catch (err) {
                const error = err as ApiError;
                // then
                expect(error.response.statusCode).toBe(400);
                expect(error.response.body.message).toBe("Invalid movie schema");
                expect(error.response.body.errorCode).toBe("BAD_REQUEST");
                return;
            }

            fail("Test should not reach here");
        }
    );

    it("Should throw error if provided genres are not defined in predefined genres", async () => {
        // given
        const movieInput: MovieInput = {
            ...validRequiredMovieInputProps,
            genres: ["values", "not", "described", "in", "predefined", "genres"],
        };

        try {
            // when
            await sendPostRequest(movieInput);
        } catch (err) {
            const error = err as ApiError;
            // then
            expect(error.response.statusCode).toBe(400);
            expect(error.response.body.message).toBe("Provided genre is not recognised");
            expect(error.response.body.errorCode).toBe("INVALID_INPUT_GENRE");
            return;
        }

        fail("Test should not reach here");
    });
});
