import { ParsedQuery } from "../dto/query.dto";
import { ContainerDependencies } from "../dependency-injection/container";
import { MovieRepository } from "../repository/movie.repository";
import { Movie, MovieInput, MovieValidator } from "../dto/movie.dto";
import { Exception } from "../error/exception";
import { HTTP_ERROR_CODE, MOVIE_ERROR_CODE } from "../error/error-codes";
import { ZodError } from "zod";
import { Logger } from "../util/logger";

export class MovieService {
    movieRepository: MovieRepository;
    logger: Logger;

    constructor({ movieRepository, logger }: ContainerDependencies) {
        this.movieRepository = movieRepository;
        this.logger = logger;
    }

    getMovies(_query: ParsedQuery): Movie[] {
        return this.movieRepository.getMovies();
    }

    addMovie(movieInputDto: MovieInput): Movie {
        this.validate(movieInputDto);
        const movie = this.prepareMoviePayload(movieInputDto);

        return this.movieRepository.saveMovie(movie);
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

        this.logger.debug("Successfully validated input movie");
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
