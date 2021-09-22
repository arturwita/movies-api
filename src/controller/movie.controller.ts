import { Request, Response, NextFunction } from "express";
import { ContainerDependencies } from "../dependency-injection/container";
import { MovieService } from "../service/movie.service";
import { ParsedQuery, QueryParams } from "./dto/query.dto";

type RequestWithParams = Request<{}, {}, {}, QueryParams>;

export class MovieController {
    readonly movieService: MovieService;

    constructor({ movieService }: ContainerDependencies) {
        this.movieService = movieService;
    }

    getMovies(req: RequestWithParams, res: Response, _next: NextFunction): void {
        const query = this.parseQuery(req.query);

        this.movieService.getMovies(query);

        res.send({ getMovies: "TODO" });
    }

    addMovie(_req: Request, res: Response, _next: NextFunction): void {
        this.movieService.addMovie();

        res.send({ addMovie: "TODO" });
    }

    private parseQuery(query: QueryParams): ParsedQuery {
        const { duration, genres } = query;

        return {
            duration: duration ? Number.parseInt(duration, 10) : null,
            genres: genres ? genres.split(",") : null,
        };
    }
}
