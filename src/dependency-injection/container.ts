import { asClass, asValue, createContainer, InjectionMode, AwilixContainer } from "awilix";
import config, { IConfig } from "config";
import { Express } from "express";
import { Logger } from "../util";
import { MovieRouter } from "../router";
import { MovieController } from "../controller";
import { MovieService } from "../service";
import { MovieRepository } from "../repository";
import { LoggerMiddleware, ErrorHandlerMiddleware } from "../middleware";
import { MovieValidator, QueryValidator } from "../validator";

export interface AppDependencies {
    app: Express;
    config: IConfig;
    logger: Logger;
    loggerMiddleware: LoggerMiddleware;
    errorHandler: ErrorHandlerMiddleware;
    movieValidator: MovieValidator;
    queryValidator: QueryValidator;
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
            movieValidator: asClass(MovieValidator),
            queryValidator: asClass(QueryValidator),
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
