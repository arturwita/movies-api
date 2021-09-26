import { writeFileSync } from "fs";
import { MovieRepository } from "../../../src/repository";
import { getDbPath } from "../test-db-utils";
import { Genre, Movie } from "../../../src/dto";
import { exampleMovies } from "./test-payloads";

describe("Movie Repository", () => {
    let movieRepository: MovieRepository;

    const config = {
        get: jest.fn(() => ({
            durationOffset: 10,
            dbPath: getDbPath("movie-repository-test-file.json"),
        })),
    };

    beforeEach(() => {
        // @ts-ignore
        movieRepository = new MovieRepository({ config });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Get Movies", () => {
        it("Should read movies from db and convert them to application format", () => {
            // when
            const movies = movieRepository.getMovies();

            // then
            expect(movies).toEqual(expect.arrayContaining(exampleMovies));
        });
    });

    describe("Find Movie By Data", () => {
        it("Should return a movie with exact the same title, year, runtime, director and genres", () => {
            // given
            const existingMovie: Movie = {
                id: 2, // different id
                title: "Beetlejuice",
                year: 1988,
                runtime: 92,
                genres: ["Comedy", "Fantasy"],
                director: "Tim Burton",
            };
            const { id: _id, ...commonMovieProperties } = existingMovie;

            // when
            const foundMovie = movieRepository.findMovieByData(existingMovie);

            // then
            expect(foundMovie).toEqual(expect.objectContaining(commonMovieProperties));
        });

        it("Should return null if movie with given data does not exist in db", () => {
            // given
            const newMovie: Movie = {
                id: 5,
                title: "Star Wars III",
                year: 2005,
                runtime: 140,
                genres: ["Adventure", "Sci-Fi"],
                director: "George Lucas",
            };

            // when
            const foundMovie = movieRepository.findMovieByData(newMovie);

            // then
            expect(foundMovie).toBeNull();
        });
    });

    describe("Get Movies In Runtime Range", () => {
        it("Should return movies with runtime between <duration - offset> and <duration + offset>.", () => {
            // given
            const duration = 135;
            const [, ...expectedMovies] = exampleMovies;

            // when
            const moviesInRuntimeRange = movieRepository.getMoviesInRuntimeRange(exampleMovies, duration);

            // then
            expect(moviesInRuntimeRange).toEqual(expect.arrayContaining(expectedMovies));
        });
    });

    describe("Get Random Movie", () => {
        it("Should return random movie from all movies", () => {
            // given
            const index = 0;
            const getRandomNumber = (): number => index;
            const expectedMovie = exampleMovies[index];

            // when
            const randomMovie = movieRepository.getRandomMovie(getRandomNumber);

            // then
            expect(randomMovie).toEqual(expect.objectContaining(expectedMovie));
        });

        it("Should return random movie from movies in duration range", () => {
            // given
            const duration = 92;
            const index = 0;
            const getRandomNumber = (): number => index;
            const expectedMovie = exampleMovies[index];

            // when
            const randomMovie = movieRepository.getRandomMovie(getRandomNumber, duration);

            // then
            expect(randomMovie).toEqual(expect.objectContaining(expectedMovie));
        });

        it("Should return null if there are no movies in db", () => {
            // given
            const config = {
                get: jest.fn(() => ({
                    durationOffset: 10,
                    dbPath: getDbPath("empty-movies-test-file.json"),
                })),
            };
            // @ts-ignore
            const movieRepository = new MovieRepository({ config });

            // when
            const randomMovie = movieRepository.getRandomMovie();

            // then
            expect(randomMovie).toBeNull();
        });
    });

    describe("Get Movies Matching Genres", () => {
        it("Should return movies with genres consisting of any combination of provided genres and sort them by number of fitting genres", () => {
            // given
            const genres: Genre[] = ["Crime", "Drama", "Music"];
            const [, ...expectedMovies] = exampleMovies;

            // when
            const matchingMovies = movieRepository.getMoviesMatchingGenres(genres);

            // then
            expect(matchingMovies).toEqual(expect.arrayContaining(expectedMovies));
        });
    });

    describe("Save Movie", () => {
        // given
        const dbPath = getDbPath("save-movie-test-file.json");
        const config = {
            get: jest.fn(() => ({
                durationOffset: 10,
                dbPath,
            })),
        };
        // @ts-ignore
        const movieRepository = new MovieRepository({ config });

        afterAll(() => {
            const dbPayload = { movies: [] };
            const clearedDb = JSON.stringify(dbPayload, null, 4);
            writeFileSync(dbPath, clearedDb);
        });

        it("Should save a new movie to file and return it", () => {
            const newMovie: Movie = {
                id: 5,
                title: "Star Wars III",
                year: 2005,
                runtime: 140,
                genres: ["Adventure", "Sci-Fi"],
                director: "George Lucas",
            };

            // when
            const savedMovie = movieRepository.saveMovie(newMovie);

            // then
            expect(savedMovie).toEqual(expect.objectContaining(newMovie));
        });
    });
});
