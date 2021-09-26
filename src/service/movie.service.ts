/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { random } from "lodash";
import { AppDependencies } from "../dependency-injection";
import { Movie, MovieInput, ParsedQuery } from "../dto";
import { MovieRepository } from "../repository";
import { Exception, HTTP_ERROR_CODE, MOVIE_ERROR_CODE } from "../error";
import { Logger } from "../util";

export class MovieService {
    movieRepository: MovieRepository;
    logger: Logger;

    constructor({ movieRepository, logger }: AppDependencies) {
        this.movieRepository = movieRepository;
        this.logger = logger;
    }

    getMovies(query: ParsedQuery): Movie[] {
        const { duration, genres } = query;

        switch (true) {
            case !!(duration && genres): {
                const moviesMatchingGenres = this.movieRepository.getMoviesMatchingGenres(genres!);
                return this.movieRepository.getMoviesInRuntimeRange(moviesMatchingGenres, duration!);
            }
            case !!duration: {
                const randomMovie = this.movieRepository.getRandomMovie(random, duration!);
                if (!randomMovie) {
                    this.logger.error("No movies found");
                    throw new Exception(422, "No movies found", HTTP_ERROR_CODE.UNPROCESSABLE_ENTITY);
                }

                return [randomMovie];
            }
            case !!genres: {
                return this.movieRepository.getMoviesMatchingGenres(genres!);
            }
            default: {
                const randomMovie = this.movieRepository.getRandomMovie();
                if (!randomMovie) {
                    this.logger.error("No movies found");
                    throw new Exception(422, "No movies found", HTTP_ERROR_CODE.UNPROCESSABLE_ENTITY);
                }

                return [randomMovie];
            }
        }
    }

    addMovie(movieInput: MovieInput): Movie {
        const newMovie = this.prepareMoviePayload(movieInput);

        const movieExists = this.movieRepository.findMovieByData(newMovie);

        if (movieExists) {
            this.logger.error("Given movie already exists", newMovie);
            throw new Exception(400, "Given movie already exists", MOVIE_ERROR_CODE.MOVIE_ALREADY_EXISTS);
        }

        return this.movieRepository.saveMovie(newMovie);
    }

    prepareMoviePayload(movieInput: MovieInput): Movie {
        const allMovies = this.movieRepository.getMovies();
        const id = allMovies.length + 1;

        return {
            id,
            ...movieInput,
        };
    }
}
