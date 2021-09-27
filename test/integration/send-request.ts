import got, { CancelableRequest } from "got";
import { MovieInput, QueryParams } from "../../src/dto";

type HttpMethod = "GET" | "POST" | "OPTIONS";

interface RequestPayload {
    body: MovieInput;
    query?: QueryParams;
}

export const sendRequest = (method: HttpMethod, payload?: RequestPayload): CancelableRequest => {
    let searchParams: string | undefined = undefined;
    let body: string | undefined = undefined;

    if (method === "GET" && payload?.query) {
        searchParams = JSON.stringify(payload.query);
    }
    if (method === "POST" && payload?.body) {
        body = JSON.stringify(payload.body);
    }

    return got("http://localhost:8000/movies", {
        method,
        searchParams,
        body,
        responseType: "json",
    });
};
