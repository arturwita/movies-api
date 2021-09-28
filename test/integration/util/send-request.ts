import got, { CancelableRequest } from "got";
import { MovieInput, QueryParams } from "../../../src/dto";

export const moviesApiUrl = "http://localhost:8000/movies";

export const sendGetRequest = (query: QueryParams): CancelableRequest =>
    got(moviesApiUrl, {
        searchParams: JSON.stringify(query),
        responseType: "json",
    });

export const sendPostRequest = (movieInput: MovieInput): CancelableRequest =>
    got.post(moviesApiUrl, {
        json: movieInput,
        responseType: "json",
    });
