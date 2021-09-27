import dotenv from "dotenv";
dotenv.config();

import express from "express";
import config from "config";
import cors from "cors";
import { corsConfig } from "./config/cors.config";
import { Container } from "./src/dependency-injection";
import { moviesUrl } from "./src/router";

const { app, logger, movieRouter, loggerMiddleware, errorHandler } = new Container(express(), config).cradle();

app.use(express.json());
app.use(cors(corsConfig));
app.use(loggerMiddleware.use.bind(loggerMiddleware));
app.use(moviesUrl, movieRouter.getRouter());
app.use(errorHandler.use.bind(errorHandler));

const { port } = config.get("app");

app.listen(port, () => {
    logger.info(`App listening at http://localhost:${port}`);
});
