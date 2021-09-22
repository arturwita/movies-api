import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Container } from "./src/dependency-injection/container";
import { movieUrl } from "./src/router/movie-routes";

const { app, config, logger, movieRoutes } = new Container({ app: express() }).cradle();

app.use(movieUrl, movieRoutes.getRouter());

const { port } = config.get("app");

app.listen(port, () => {
    logger.info(`App listening at http://localhost:${port}`);
});
