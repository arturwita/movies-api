import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    methods: ["GET", "POST"],
    origin: "*",
    maxAge: 86400,
};
