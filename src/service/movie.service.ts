import { ZodError } from "zod";
import { ParsedQuery } from "../dto/query.dto";
import { AppDependencies } from "../dependency-injection/container";
import { MovieRepository } from "../repository/movie.repository";
import { Movie, MovieInput, MovieValidator } from "../dto/movie.dto";
import { Exception } from "../error/exception";
import { HTTP_ERROR_CODE, MOVIE_ERROR_CODE } from "../error/error-codes";
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
            case !duration && !genres: {
                const randomMovie = this.movieRepository.getRandomMovie();
                return [randomMovie];
            }
            case !!duration: {
                const randomMovie = this.movieRepository.getRandomMovie(duration);
                return [randomMovie];
            }
            default: {
                return this.movieRepository.getMovies();
            }
        }
    }

    addMovie(movieInputDto: MovieInput): Movie {
        this.validate(movieInputDto);
        const newMovie = this.prepareMoviePayload(movieInputDto);

        const movieExists = this.movieRepository.findMovieByData(newMovie);

        if (movieExists) {
            this.logger.error("Given movie already exists", newMovie);
            throw new Exception(400, "Given movie already exists", MOVIE_ERROR_CODE.MOVIE_ALREADY_EXISTS);
        }

        return this.movieRepository.saveMovie(newMovie);
    }

    validate(movieInputDto: MovieInput): void {
        try {
            MovieValidator.parse(movieInputDto);
        } catch (error) {
            this.logger.error("Input movie DTO does not match given schema", movieInputDto);
            throw new Exception(400, "Invalid movie schema", HTTP_ERROR_CODE.BAD_REQUEST, {
                validation: (error as ZodError).issues,
            });
        }

        const predefinedGenres = this.movieRepository.getGenres();

        movieInputDto.genres.forEach(inputGenre => {
            if (!predefinedGenres.includes(inputGenre)) {
                const details = {
                    invalidGenre: inputGenre,
                };

                this.logger.error("Input movie DTO contains unrecognised genre", details);
                throw new Exception(
                    400,
                    "Provided genre is not recognised",
                    MOVIE_ERROR_CODE.INVALID_INPUT_GENRE,
                    details
                );
            }
        });
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
