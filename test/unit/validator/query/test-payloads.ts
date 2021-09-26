import { ParsedQuery } from "../../../../src/dto";

export const predefinedGenres = ["Biography", "Drama", "Thriller"];

export const validParsedQuery: ParsedQuery[] = [
    {
        duration: undefined,
        genres: undefined,
    },
    {
        duration: 60,
        genres: predefinedGenres,
    },
];
