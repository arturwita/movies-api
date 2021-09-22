import { asClass, asValue, createContainer, InjectionMode, AwilixContainer } from "awilix";
import config, { IConfig } from "config";
import { Express } from "express";
import { Logger } from "../util/logger";
import { MovieRoutes } from "../router/movie-routes";
import { MovieController } from "../controller/movie.controller";
import { MovieService } from "../service/movie.service";
import { MovieRepository } from "../repository/movie.repository";
import { LoggerMiddleware } from "../middleware/logger.middleware";
import { ErrorHandlerMiddleware } from "../middleware/error-handler.middleware";

export interface ContainerDependencies {
    app: Express;
    config: IConfig;
    logger: Logger;
    loggerMiddleware: LoggerMiddleware;
    errorHandler: ErrorHandlerMiddleware;
    movieRoutes: MovieRoutes;
    movieController: MovieController;
    movieService: MovieService;
    movieRepository: MovieRepository;
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
            loggerMiddleware: asClass(LoggerMiddleware),
            errorHandler: asClass(ErrorHandlerMiddleware),
            movieRoutes: asClass(MovieRoutes),
            movieController: asClass(MovieController),
            movieService: asClass(MovieService),
            movieRepository: asClass(MovieRepository),
        });
    }

    cradle(): ContainerDependencies {
        return this.container.cradle;
    }
}
