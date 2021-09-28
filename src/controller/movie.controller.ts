import { Request, Response, NextFunction } from "express";
import { AppDependencies } from "../dependency-injection";
import { MovieService } from "../service";
import { MovieInput, ParsedQuery, QueryParams } from "../dto";
import { MovieValidator, QueryValidator } from "../validator";

export type CustomRequest = Request<{}, {}, MovieInput, QueryParams>;

export class MovieController {
    readonly movieService: MovieService;
    readonly movieValidator: MovieValidator;
    readonly queryValidator: QueryValidator;

    constructor({ movieService, movieValidator, queryValidator }: AppDependencies) {
        this.movieService = movieService;
        this.movieValidator = movieValidator;
        this.queryValidator = queryValidator;
    }

    parseQuery(query: QueryParams): ParsedQuery {
        const { duration, genres } = query;

        return {
            duration: duration ? Number.parseInt(duration, 10) : null,
            genres: genres ? JSON.parse(genres) : null,
        };
    }

    getMovies(request: CustomRequest, response: Response, _next: NextFunction): void {
        const parsedQuery = this.parseQuery(request.query);
        const query = this.queryValidator.validate(parsedQuery);

        const result = this.movieService.getMovies(query);
        const body = Array.isArray(result) ? { movies: result } : { movie: result };

        response.status(200).send(body);
    }

    addMovie(request: CustomRequest, response: Response, _next: NextFunction): void {
        const movieInput = this.movieValidator.validate(request.body);

        const movie = this.movieService.addMovie(movieInput);

        response.status(201).send({ movie });
    }
}
