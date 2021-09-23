import { asClass, asValue, createContainer, InjectionMode, AwilixContainer } from "awilix";
import config, { IConfig } from "config";
import { Express } from "express";
import { Logger } from "../util";
import { MovieRouter } from "../router/movie-router";
import { MovieController } from "../controller/movie.controller";
import { MovieService } from "../service/movie.service";
import { MovieRepository } from "../repository/movie.repository";
import { LoggerMiddleware } from "../middleware/logger.middleware";
import { ErrorHandlerMiddleware } from "../middleware/error-handler.middleware";

export interface AppDependencies {
    app: Express;
    config: IConfig;
    logger: Logger;
    loggerMiddleware: LoggerMiddleware;
    errorHandler: ErrorHandlerMiddleware;
    movieRouter: MovieRouter;
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
            movieRouter: asClass(MovieRouter),
            movieController: asClass(MovieController),
            movieService: asClass(MovieService),
            movieRepository: asClass(MovieRepository),
        });
    }

    cradle(): AppDependencies {
        return this.container.cradle;
    }
}
