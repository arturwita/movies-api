import { ZodError } from "zod";
import { Genre, MovieInput, MovieSchema } from "../dto";
import { AppDependencies } from "../dependency-injection";
import { Exception, HTTP_ERROR_CODE, MOVIE_ERROR_CODE } from "../error";
import { Logger } from "../util";

export class MovieValidator {
    logger: Logger;

    constructor({ logger }: AppDependencies) {
        this.logger = logger;
    }

    validate(movieInput: MovieInput, predefinedGenres: Genre[]): MovieInput {
        let parsedMovie: MovieInput;

        try {
            parsedMovie = MovieSchema.parse(movieInput);
        } catch (error) {
            this.logger.error("Input movie DTO does not match given schema", movieInput);
            throw new Exception(400, "Invalid movie schema", HTTP_ERROR_CODE.BAD_REQUEST, {
                validation: (error as ZodError).issues,
            });
        }

        movieInput.genres.forEach(inputGenre => {
            if (!predefinedGenres.includes(inputGenre)) {
                const details = {
                    invalidGenre: inputGenre,
                    predefinedGenres,
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

        return parsedMovie;
    }
}
