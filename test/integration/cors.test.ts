import got from "got";
import { moviesApiUrl } from "./helper/send-request.helper";

describe("CORS", () => {
    it("Should be enabled", async () => {
        const { statusCode, headers } = await got(moviesApiUrl, {
            method: "OPTIONS",
            responseType: "json",
        });

        expect(statusCode).toBe(204);
        expect(headers["access-control-allow-origin"]).toBe("*");
        expect(headers["access-control-allow-methods"]).toBe("GET,POST");
    });
});
