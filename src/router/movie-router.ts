import { Router } from "express";
import { AppDependencies } from "../dependency-injection";

export class MovieRouter {
    readonly router: Router;

    constructor({ movieController }: AppDependencies) {
        this.router = Router();

        this.router.get("/", movieController.getMovies.bind(movieController));
        this.router.post("/", movieController.addMovie.bind(movieController));
    }

    getRouter(): Router {
        return this.router;
    }
}
