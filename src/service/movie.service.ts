/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
            case !duration && !genres: {
                const randomMovie = this.movieRepository.getRandomMovie();
                return [randomMovie];
            }
            case !!duration: {
                const randomMovie = this.movieRepository.getRandomMovie(duration);
                return [randomMovie];
            }
            case !!genres: {
                return this.movieRepository.getMoviesMatchingGenres(genres!);
            }
            default: {
                this.logger.error("Unhandled execution path", query);
                throw new Exception(501, "Not implemented", HTTP_ERROR_CODE.NOT_IMPLEMENTED);
            }
        }
    }

    addMovie(movieInputDto: MovieInput): Movie {
        const newMovie = this.prepareMoviePayload(movieInputDto);

        const movieExists = this.movieRepository.findMovieByData(newMovie);

        if (movieExists) {
            this.logger.error("Given movie already exists", newMovie);
            throw new Exception(400, "Given movie already exists", MOVIE_ERROR_CODE.MOVIE_ALREADY_EXISTS);
        }

        return this.movieRepository.saveMovie(newMovie);
    }

    prepareMoviePayload(movieInputDto: MovieInput): Movie {
        const allMovies = this.movieRepository.getMovies();
        const id = allMovies.length + 1;

        return {
            id,
            ...movieInputDto,
        };
    }
}
