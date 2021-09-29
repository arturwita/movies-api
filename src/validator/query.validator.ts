import { AppDependencies } from "../dependency-injection";
import { Genre, ParsedQuery, QueryParams } from "../dto";
import { Exception, HTTP_ERROR_CODE } from "../error";
import { Logger } from "../util";

export class QueryValidator {
    logger: Logger;

    constructor({ logger }: AppDependencies) {
        this.logger = logger;
    }

    validate(query: QueryParams, predefinedGenres: Genre[]): ParsedQuery {
        const duration = query.duration ? Number.parseInt(query.duration, 10) : null;
        let genres: string[] | null;

        try {
            genres = query.genres ? JSON.parse(query.genres) : null;
        } catch (error) {
            this.logger.error("Could not parse genres to an array", query.genres);
            throw new Exception(400, "Could not parse genres to an array", HTTP_ERROR_CODE.BAD_REQUEST, query.genres);
        }

        if (duration !== null && isNaN(duration)) {
            this.logger.error("Could not parse duration to number", query.duration);
            throw new Exception(400, "Could not parse duration to number", HTTP_ERROR_CODE.BAD_REQUEST, query.duration);
        }

        if (genres && !Array.isArray(genres)) {
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
