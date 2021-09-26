import { AppDependencies } from "../dependency-injection";
import { genres as _predefinedGenres } from "../../data/db.json";
import { Genre, ParsedQuery } from "../dto";
import { Exception, HTTP_ERROR_CODE } from "../error";
import { Logger } from "../util";

export class QueryValidator {
    logger: Logger;

    constructor({ logger }: AppDependencies) {
        this.logger = logger;
    }

    validate(query: ParsedQuery, predefinedGenres: Genre[] = _predefinedGenres): ParsedQuery {
        const { duration, genres } = query;

        if (duration !== undefined && isNaN(duration)) {
            this.logger.error("Could not parse duration to number", query.duration);
            throw new Exception(400, "Could not parse duration to number", HTTP_ERROR_CODE.BAD_REQUEST, query.duration);
        }

        if (genres !== undefined && !Array.isArray(genres)) {
            this.logger.error("Genres should be an array", query.genres);
            throw new Exception(400, "Genres should be an array", HTTP_ERROR_CODE.BAD_REQUEST, query.genres);
        }

        if (genres) {
            const areGenresValid = genres.every(inputGenre => predefinedGenres.includes(inputGenre));

            if (!areGenresValid) {
                this.logger.error("Genres contain values outside the predefined genres", query.genres);
                throw new Exception(
                    400,
                    "Genres contain values outside the predefined genres",
                    HTTP_ERROR_CODE.BAD_REQUEST,
                    query.genres
                );
            }
        }

        return { duration, genres };
    }
}
