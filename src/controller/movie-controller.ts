import { Request, Response, NextFunction } from "express";
import { ContainerDependencies } from "../dependency-injection/container";
import { MovieService } from "../service/movie-service";

export class MovieController {
    readonly movieService: MovieService;

    constructor({ movieService }: ContainerDependencies) {
        this.movieService = movieService;
    }

    getMovies(_req: Request, res: Response, _next: NextFunction): void {
        // const { duration, genres } = req.query;
        // const response = this.movieService.getMovies();

        res.send({ getMovies: "TODO" });
    }

    addMovie(_req: Request, res: Response, _next: NextFunction): void {
        // const response = this.movieService.addMovie();

        res.send({ addMovie: "TODO" });
    }
}
