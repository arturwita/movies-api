import { Router } from "express";
import { ContainerDependencies } from "../dependency-injection/container";

export const movieUrl = "/movies";

export class MovieRoutes {
    readonly router: Router;

    constructor({ movieController }: ContainerDependencies) {
        this.router = Router();

        this.router.get("/", movieController.getMovies.bind(movieController));
        this.router.post("/", movieController.addMovie.bind(movieController));
    }

    getRouter(): Router {
        return this.router;
    }
}