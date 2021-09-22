import { asClass, asValue, createContainer, InjectionMode, AwilixContainer } from "awilix";
import config, { IConfig } from "config";
import { Express } from "express";
import { Logger } from "../util/logger";
import { MovieRoutes } from "../router/movie-routes";
import { MovieController } from "../controller/movie-controller";
import { MovieService } from "../service/movie-service";

export interface ContainerDependencies {
    app: Express;
    config: IConfig;
    logger: Logger;
    movieRoutes: MovieRoutes;
    movieController: MovieController;
    movieService: MovieService;
}

export class Container {
    readonly container: AwilixContainer;

    constructor(app: Express) {
        this.container = createContainer({
            injectionMode: InjectionMode.PROXY,
        });

        this.container.register({
            app: asValue(app),
            config: asValue(config),
            logger: asClass(Logger),
            movieService: asClass(MovieService),
            movieController: asClass(MovieController),
            movieRoutes: asClass(MovieRoutes),
        });
    }

    cradle(): ContainerDependencies {
        return this.container.cradle;
    }
}