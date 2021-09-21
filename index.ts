import dotenv from "dotenv";
dotenv.config();

import config from "config";
import express from "express";

const app = express();

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

const { port } = config.get("app");

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
