import dotenv from "dotenv";
dotenv.config();

import config from "config";
import express from "express";
import { Logger } from "./src/util/logger";

const app = express();

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

const { port } = config.get("app");

app.listen(port, () => {
    new Logger().info(`App listening at http://localhost:${port}`);
});
