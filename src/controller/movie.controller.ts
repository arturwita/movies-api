import { Request, Response, NextFunction } from "express";
import { AppDependencies } from "../dependency-injection";
import { MovieService } from "../service";
import { MovieInput, ParsedQuery, QueryParams } from "../dto";
import { MovieValidator, QueryValidator } from "../validator";

type CustomRequest = Request<{}, {}, MovieInput, QueryParams>;

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

    getMovies(req: CustomRequest, res: Response, _next: NextFunction): void {
        const parsedQuery = this.parseQuery(req.query);
        const query = this.queryValidator.validate(parsedQuery);

        const movies = this.movieService.getMovies(query);

        res.status(200).send({ movies });
    }

    addMovie(req: CustomRequest, res: Response, _next: NextFunction): void {
        const movieInput = req.body;
        this.movieValidator.validate(req.body);

        const movie = this.movieService.addMovie(movieInput);

        res.status(201).send({ movie });
    }
}
