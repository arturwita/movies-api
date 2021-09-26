import { MovieService } from "../../../src/service";
import { Movie, MovieInput, ParsedQuery } from "../../../src/dto";
import { assertCustomError } from "../../assert-custom-error";
import { Exception, ExceptionProps } from "../../../src/error";
import each from "jest-each";

describe("Movie Service", () => {
    let movieService: MovieService;

    const movieInput: MovieInput = {
        title: "The Imitation Game",
        year: 2014,
        runtime: 114,
        director: "Morten Tyldum",
        genres: ["Biography", "Drama", "Thriller"],
    };

    const logger = {
        error: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Prepare Movie Payload", () => {
        const movieRepository = {
            getMovies: jest.fn(() => []),
        };

        // @ts-ignore
        movieService = new MovieService({ movieRepository, logger });

        it("Should generate movie id and return payload of Movie type", () => {
            // given
            const expectedMovie: Movie = {
                id: 1,
                ...movieInput,
            };

            // when
            const preparedMovie = movieService.prepareMoviePayload(movieInput);

            // then
            expect(preparedMovie).toEqual(expectedMovie);
        });
    });

    describe("Add Movie", () => {
        it("Should return saved movie if it was not already in db", () => {
            // given
            const newMovie: MovieInput = {
                title: "Star Wars III",
                year: 2005,
                runtime: 140,
                genres: ["Adventure", "Sci-Fi"],
                director: "George Lucas",
            };
            const expectedMovie = {
                id: 1,
                ...newMovie,
            };

            const movieRepository = {
                getMovies: jest.fn(() => []),
                findMovieByData: jest.fn(() => false),
                saveMovie: jest.fn(() => expectedMovie),
            };

            // @ts-ignore
            movieService = new MovieService({ movieRepository, logger });

            // when
            const savedMovie = movieService.addMovie(newMovie);

            // then
            expect(savedMovie).toEqual(expectedMovie);
        });

        it("Should throw error if movie already exists in db", () => {
            // given
            const movieRepository = {
                getMovies: jest.fn(() => []),
                findMovieByData: jest.fn(() => true),
            };

            // @ts-ignore
            movieService = new MovieService({ movieRepository, logger });

            const newMovie: MovieInput = {
                title: "Star Wars III",
                year: 2005,
                runtime: 140,
                genres: ["Adventure", "Sci-Fi"],
                director: "George Lucas",
            };
            const expectedError: ExceptionProps = {
                status: 400,
                message: "Given movie already exists",
                errorCode: "MOVIE_ALREADY_EXISTS",
            };

            try {
                // when
                movieService.addMovie(newMovie);
            } catch (error) {
                // then
                assertCustomError(expectedError, error as Exception);
                return;
            }
            fail("Test should not reach here");
        });
    });

    describe("Get Movies", () => {
        it("Should return movies matching genres in runtime range if both duration and genres params were provided", () => {
            // given
            const query: ParsedQuery = {
                duration: 114,
                genres: ["Drama"],
            };
            const expectedMovies: Movie[] = [
                {
                    id: 1,
                    ...movieInput,
                },
            ];
            const movieRepository = {
                getMoviesMatchingGenres: jest.fn(() => []),
                getMoviesInRuntimeRange: jest.fn(() => expectedMovies),
            };

            // @ts-ignore
            movieService = new MovieService({ movieRepository, logger });

            // when
            const collectedMovies = movieService.getMovies(query);

            // then
            expect(collectedMovies).toEqual(expectedMovies);
        });

        it("Should return random movie in runtime range if duration param was provided and there are movies in db", () => {
            // given
            const query: ParsedQuery = {
                duration: 114,
                genres: null,
            };
            const randomMovie: Movie = {
                id: 1,
                ...movieInput,
            };
            const expectedMovies = [randomMovie];

            const movieRepository = {
                getRandomMovie: jest.fn(() => randomMovie),
            };

            // @ts-ignore
            movieService = new MovieService({ movieRepository, logger });

            // when
            const collectedMovies = movieService.getMovies(query);

            // then
            expect(collectedMovies).toEqual(expectedMovies);
        });

        each([
            // Case 1: duration was provided
            {
                duration: 114,
                genres: null,
            },
            // Case 2: no params were provided
            {
                duration: null,
                genres: null,
            },
        ]).it("Should throw error if there are no movies in db", query => {
            // given
            const expectedError: ExceptionProps = {
                status: 422,
                message: "No movies found",
                errorCode: "UNPROCESSABLE_ENTITY",
            };

            const movieRepository = {
                getRandomMovie: jest.fn(() => false),
            };

            // @ts-ignore
            movieService = new MovieService({ movieRepository, logger });

            try {
                // when
                movieService.getMovies(query);
            } catch (error) {
                assertCustomError(expectedError, error as Exception);
                return;
            }
            fail("Test should not reach here");
        });

        it("Should return movies matching genres if genres param was provided", () => {
            // given
            const query: ParsedQuery = {
                duration: null,
                genres: ["Drama"],
            };
            const expectedMovies = [movieInput];

            const movieRepository = {
                getMoviesMatchingGenres: jest.fn(() => expectedMovies),
            };

            // @ts-ignore
            movieService = new MovieService({ movieRepository, logger });

            // when
            const collectedMovies = movieService.getMovies(query);

            // then
            expect(collectedMovies).toEqual(expectedMovies);
        });

        it("Should return random movie if no params were provided", () => {
            // given
            const query: ParsedQuery = {
                duration: null,
                genres: null,
            };
            const randomMovie: Movie = {
                id: 1,
                ...movieInput,
            };
            const expectedMovies = [randomMovie];

            const movieRepository = {
                getRandomMovie: jest.fn(() => randomMovie),
            };

            // @ts-ignore
            movieService = new MovieService({ movieRepository, logger });

            // when
            const collectedMovies = movieService.getMovies(query);

            // then
            expect(collectedMovies).toEqual(expectedMovies);
        });
    });
});
