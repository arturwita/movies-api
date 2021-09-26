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
            duration: duration ? Number.parseInt(duration, 10) : undefined,
            genres: genres ? JSON.parse(genres) : undefined,
        };
    }

    getMovies(request: CustomRequest, response: Response, _next: NextFunction): void {
        const parsedQuery = this.parseQuery(request.query);
        const query = this.queryValidator.validate(parsedQuery);

        const movies = this.movieService.getMovies(query);

        response.status(200).send({ movies });
    }

    addMovie(request: CustomRequest, response: Response, _next: NextFunction): void {
        const movieInput = request.body;
        this.movieValidator.validate(movieInput);

        const movie = this.movieService.addMovie(movieInput);

        response.status(201).send({ movie });
    }
}
