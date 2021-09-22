import { Router } from "express";
import { ContainerDependencies } from "../dependency-injection/container";

export class MovieRouter {
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
