import { Request, Response, NextFunction } from "express";
import { ContainerDependencies } from "../dependency-injection/container";
import { MovieService } from "../service/movie.service";
import { ParsedQuery, QueryParams } from "../dto/query.dto";
import { MovieInput } from "../dto/movie.dto";

type CustomRequest = Request<{}, {}, MovieInput, QueryParams>;

export class MovieController {
    readonly movieService: MovieService;

    constructor({ movieService }: ContainerDependencies) {
        this.movieService = movieService;
    }

    getMovies(req: CustomRequest, res: Response, _next: NextFunction): void {
        const query = this.parseQuery(req.query);

        const movies = this.movieService.getMovies(query);

        res.send({ movies });
    }

    addMovie(req: CustomRequest, res: Response, _next: NextFunction): void {
        const movieInput = req.body;
        const movie = this.movieService.addMovie(movieInput);

        res.status(201).send({ movie });
    }

    private parseQuery(query: QueryParams): ParsedQuery {
        const { duration, genres } = query;

        return {
            duration: duration ? Number.parseInt(duration, 10) : null,
            genres: genres ? genres.split(",") : null,
        };
    }
}
