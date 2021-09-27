import { sendRequest } from "./send-request";

describe("CORS", () => {
    it("Should be enabled", async () => {
        // @ts-ignore
        const { statusCode, headers } = await sendRequest("OPTIONS");

        expect(statusCode).toBe(204);
        expect(headers["access-control-allow-origin"]).toBe("*");
        expect(headers["access-control-allow-methods"]).toBe("GET,POST");
    });
});
