import { Request, Response, NextFunction } from "express";
import { AppDependencies } from "../dependency-injection";
import { MovieService } from "../service";
import { Genre, MovieInput, QueryParams } from "../dto";
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

    getMovies(request: CustomRequest, response: Response, _next: NextFunction): void {
        const predefinedGenres = this.getPredefinedGenres();
        const query = this.queryValidator.validate(request.query, predefinedGenres);

        const result = this.movieService.getMovies(query);
        const body = Array.isArray(result) ? { movies: result } : { movie: result };

        response.status(200).send(body);
    }

    addMovie(request: CustomRequest, response: Response, _next: NextFunction): void {
        const predefinedGenres = this.getPredefinedGenres();
        const movieInput = this.movieValidator.validate(request.body, predefinedGenres);

        const movie = this.movieService.addMovie(movieInput);

        response.status(201).send({ movie });
    }

    getPredefinedGenres(): Genre[] {
        return this.movieService.getGenres();
    }
}
