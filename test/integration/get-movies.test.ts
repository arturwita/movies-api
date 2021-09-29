import each from "jest-each";
import { addToDb, clearDb, readDb, sendGetRequest, ApiError } from "./util";
import {
    dramaMovie,
    biographyDramaMovie,
    comedyCrimeMovie,
    defaultMovieInput,
    longMovie,
    noMoviesInDbErrorCases,
    biographyMovie,
    shortMovie,
    longBiographyMovie,
    shortBiographyDramaMovie,
    shortDramaMovie,
} from "./test-payloads";
import { Movie, QueryParams } from "../../src/dto";

describe("GET /movies", () => {
    beforeEach(() => {
        clearDb();
    });

    afterAll(() => {
        clearDb();
    });

    each(noMoviesInDbErrorCases).it("Should throw error if there are no movies in db", async query => {
        try {
            // when
            await sendGetRequest(query);
        } catch (err) {
            const error = err as ApiError;
            // then
            expect(error.response.statusCode).toBe(422);
            expect(error.response.body.message).toBe("No movies found");
            expect(error.response.body.errorCode).toBe("UNPROCESSABLE_ENTITY");
            return;
        }

        fail("Test should not reach here");
    });

    it("Should return random movie if no params were provided", async () => {
        // given
        const query: QueryParams = {};

        const existingMovie: Movie = {
            id: 1,
            ...defaultMovieInput,
        };
        addToDb(existingMovie);
        const { movies: savedMovies } = readDb();

        expect(savedMovies).toEqual(expect.arrayContaining([existingMovie]));

        // when
        // @ts-ignore
        const { body, statusCode } = await sendGetRequest(query);

        // then
        expect(statusCode).toBe(200);
        expect(body).toEqual({ movie: existingMovie });
    });

    it("Should return random movie in duration range if duration was provided", async () => {
        // given
        const duration = longMovie.runtime;
        const query: QueryParams = {
            duration: `${duration}`,
        };

        addToDb(longMovie);
        addToDb(shortMovie);

        const { movies: savedMovies } = readDb();

        expect(savedMovies).toEqual(expect.arrayContaining([longMovie, shortMovie]));

        // when
        // @ts-ignore
        const { body, statusCode } = await sendGetRequest(query);

        // then
        expect(statusCode).toBe(200);
        expect(body).toEqual({ movie: longMovie });
    });

    it("Should return movie with matching genres if genres were provided", async () => {
        // given
        const query: QueryParams = {
            genres: `["Biography", "Drama"]`,
        };

        addToDb(biographyDramaMovie);
        addToDb(dramaMovie);
        addToDb(biographyMovie);
        addToDb(comedyCrimeMovie);

        const { movies: savedMovies } = readDb();

        expect(savedMovies).toEqual(
            expect.arrayContaining([biographyDramaMovie, dramaMovie, biographyMovie, comedyCrimeMovie])
        );

        // when
        // @ts-ignore
        const { body, statusCode } = await sendGetRequest(query);

        // then
        expect(statusCode).toBe(200);
        expect(body).toEqual({
            movies: expect.arrayContaining([
                expect.objectContaining(biographyDramaMovie),
                expect.objectContaining(biographyMovie),
                expect.objectContaining(dramaMovie),
            ]),
        });
    });

    it("Should return movie with matching genres in duration range if genres and duration were provided", async () => {
        // given
        const query: QueryParams = {
            genres: `["Biography", "Drama"]`,
            duration: "86",
        };

        addToDb(longBiographyMovie);
        addToDb(shortBiographyDramaMovie);
        addToDb(shortDramaMovie);
        addToDb(comedyCrimeMovie);

        const { movies: savedMovies } = readDb();

        expect(savedMovies).toEqual(
            expect.arrayContaining([longBiographyMovie, shortBiographyDramaMovie, shortDramaMovie, comedyCrimeMovie])
        );

        // when
        // @ts-ignore
        const { body, statusCode } = await sendGetRequest(query);

        // then
        expect(statusCode).toBe(200);
        expect(body).toEqual({
            movies: expect.arrayContaining([
                expect.objectContaining(shortBiographyDramaMovie),
                expect.objectContaining(shortDramaMovie),
            ]),
        });
    });

    it("Should throw error if duration was not parsed to a number", async () => {
        // given
        const query: QueryParams = {
            duration: "NaN",
        };

        try {
            // when
            await sendGetRequest(query);
        } catch (err) {
            const error = err as ApiError;
            // then
            expect(error.response.statusCode).toBe(400);
            expect(error.response.body.message).toBe("Could not parse duration to number");
            expect(error.response.body.errorCode).toBe("BAD_REQUEST");
            return;
        }

        fail("Test should not reach here");
    });

    it("Should throw error if genres could not be parsed", async () => {
        // given
        const query: QueryParams = {
            genres: "not an array",
        };

        try {
            // when
            await sendGetRequest(query);
        } catch (err) {
            const error = err as ApiError;
            // then
            expect(error.response.statusCode).toBe(400);
            expect(error.response.body.message).toBe("Could not parse genres to an array");
            expect(error.response.body.errorCode).toBe("BAD_REQUEST");
            return;
        }

        fail("Test should not reach here");
    });

    it("Should throw error if genres was not parsed to an array", async () => {
        // given
        const query: QueryParams = {
            genres: `{ "not": "an array" }`,
        };

        try {
            // when
            await sendGetRequest(query);
        } catch (err) {
            const error = err as ApiError;
            // then
            expect(error.response.statusCode).toBe(400);
            expect(error.response.body.message).toBe("Genres should be an array");
            expect(error.response.body.errorCode).toBe("BAD_REQUEST");
            return;
        }

        fail("Test should not reach here");
    });

    it("Should throw error if provided genres are not defined in predefined genres", async () => {
        // given
        const query: QueryParams = {
            genres: `["values", "not", "described", "in", "predefined", "genres"]`,
        };

        try {
            // when
            await sendGetRequest(query);
        } catch (err) {
            const error = err as ApiError;
            // then
            expect(error.response.statusCode).toBe(400);
            expect(error.response.body.message).toBe("Genres contain values outside the predefined genres");
            expect(error.response.body.errorCode).toBe("BAD_REQUEST");
            return;
        }

        fail("Test should not reach here");
    });
});
