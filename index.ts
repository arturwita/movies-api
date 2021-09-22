import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Container } from "./src/dependency-injection/container";
import { moviesUrl } from "./src/router/url";

const { app, config, logger, movieRoutes, loggerMiddleware } = new Container(express()).cradle();

app.use(express.json());
app.use(loggerMiddleware.use.bind(loggerMiddleware));
app.use(moviesUrl, movieRoutes.getRouter());

const { port } = config.get("app");

app.listen(port, () => {
    logger.info(`App listening at http://localhost:${port}`);
});
