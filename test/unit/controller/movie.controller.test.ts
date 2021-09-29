import { MovieController } from "../../../src/controller";
import { Movie } from "../../../src/dto";

describe("Movie Controller", () => {
    let movieController: MovieController;

    const movie: Movie = {
        id: 1,
        title: "The Imitation Game",
        year: 2014,
        runtime: 114,
        director: "Morten Tyldum",
        genres: ["Biography", "Drama", "Thriller"],
    };
    const movies: Movie[] = [movie];

    const getMovies = jest.fn((): Movie[] | Movie => movies);
    const movieService = {
        getMovies,
        addMovie: jest.fn(() => movie),
        getGenres: jest.fn(() => ["Biography", "Drama", "Thriller"]),
    };
    const movieValidator = {
        validate: jest.fn(),
    };
    const queryValidator = {
        validate: jest.fn(),
    };

    const request = {
        query: {},
        body: {},
    };
    const responseSend = jest.fn();
    const response = {
        status: jest.fn(() => ({
            send: responseSend,
        })),
    };
    const next = {};

    const runAssertions = (status: number, body: unknown): void => {
        expect(response.status).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(status);
        expect(responseSend).toHaveBeenCalledTimes(1);
        expect(responseSend).toHaveBeenCalledWith(body);
    };

    beforeEach(() => {
        // @ts-ignore
        movieController = new MovieController({ movieService, movieValidator, queryValidator });
    });

    afterEach(() => {
        getMovies.mockReturnValue(movies);
        jest.clearAllMocks();
    });

    describe("Get Movies", () => {
        it("Should return status 200 and an array of movies if service returns an array", () => {
            // given
            const status = 200;
            const body = { movies };

            // when
            // @ts-ignore
            movieController.getMovies(request, response, next);

            // then
            runAssertions(status, body);
        });

        it("Should return status 200 and a single movie if service returns an object", () => {
            // given
            const status = 200;
            const body = { movie };

            getMovies.mockReturnValue(movie);

            // when
            // @ts-ignore
            movieController.getMovies(request, response, next);

            // then
            runAssertions(status, body);
        });
    });

    describe("Add Movie", () => {
        it("Should return status 201 and a created movie", () => {
            // given
            const status = 201;
            const body = { movie };

            // when
            // @ts-ignore
            movieController.addMovie(request, response, next);

            // then
            runAssertions(status, body);
        });
    });
});
