import { ZodError } from "zod";
import { MovieInput, MovieSchema } from "../dto";
import { AppDependencies } from "../dependency-injection";
import { Exception, HTTP_ERROR_CODE, MOVIE_ERROR_CODE } from "../error";
import { MovieRepository } from "../repository";
import { Logger } from "../util";

export class MovieValidator {
    logger: Logger;
    movieRepository: MovieRepository;

    constructor({ logger, movieRepository }: AppDependencies) {
        this.logger = logger;
        this.movieRepository = movieRepository;
    }

    validate(movieInputDto: MovieInput): void {
        try {
            MovieSchema.parse(movieInputDto);
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
}
