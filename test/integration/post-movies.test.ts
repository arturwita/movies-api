import { addToDb, clearDb, readDb, sendPostRequest } from "./util";
import { defaultMovie, defaultMovieInput } from "./test-payloads";
import { MovieInput } from "../../src/dto";
import { ApiError } from "./util/api-error.interface";

describe("POST /movies", () => {
    beforeEach(() => {
        clearDb();
    });

    afterAll(() => {
        clearDb();
    });

    it("Should add new movie to db if it did not exist before", async () => {
        // given
        const movieInput: MovieInput = defaultMovieInput;
        const expectedResponse = {
            movie: {
                id: 1,
                ...defaultMovieInput,
            },
        };

        // when
        // @ts-ignore
        const { body, statusCode } = await sendPostRequest(movieInput);

        // then
        expect(statusCode).toBe(201);
        expect(body).toEqual(expectedResponse);
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
});
