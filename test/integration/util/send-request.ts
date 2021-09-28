import got, { CancelableRequest } from "got";
import { MovieInput, QueryParams } from "../../../src/dto";

export const moviesApiUrl = "http://localhost:8000/movies";

export const sendGetRequest = (query: QueryParams): CancelableRequest =>
    got(moviesApiUrl, {
        method: "GET",
        searchParams: JSON.stringify(query),
        responseType: "json",
    });

export const sendPostRequest = (movieInput: MovieInput): CancelableRequest =>
    got(moviesApiUrl, {
        method: "POST",
        body: JSON.stringify(movieInput),
        responseType: "json",
    });
