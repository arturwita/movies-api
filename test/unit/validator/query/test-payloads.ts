import { ParsedQuery } from "../../../../src/dto";

export const predefinedGenres = ["Biography", "Drama", "Thriller"];

export const validParsedQuery: ParsedQuery[] = [
    {
        duration: null,
        genres: null,
    },
    {
        duration: 60,
        genres: predefinedGenres,
    },
];
