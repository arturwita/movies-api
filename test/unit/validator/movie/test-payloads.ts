import { MovieInput } from "../../../../src/dto";

export const predefinedGenres = ["Biography", "Drama", "Thriller"];

export const validRequiredMovieInputProps: MovieInput = {
    title: "The Imitation Game",
    year: 2014,
    runtime: 114,
    director: "Morten Tyldum",
    genres: ["Biography", "Drama", "Thriller"],
};

export const validAllMovieInputProps: MovieInput = {
    ...validRequiredMovieInputProps,
    actors: "Benedict Cumberbatch",
    plot: "Cracking enigma code",
    posterUrl: "url",
};

export const validMovieInputCombinations: MovieInput[] = [
    validRequiredMovieInputProps,
    {
        ...validRequiredMovieInputProps,
        actors: "Benedict Cumberbatch",
        plot: "Cracking enigma code",
        posterUrl: "url",
    },
    {
        ...validRequiredMovieInputProps,
        actors: "Benedict Cumberbatch",
        plot: "Cracking enigma code",
    },
    {
        ...validRequiredMovieInputProps,
        actors: "Benedict Cumberbatch",
        posterUrl: "url",
    },
    {
        ...validRequiredMovieInputProps,
        plot: "Cracking enigma code",
        posterUrl: "url",
    },
    {
        ...validRequiredMovieInputProps,
        actors: "Benedict Cumberbatch",
    },
    {
        ...validRequiredMovieInputProps,
        plot: "Cracking enigma code",
    },
    {
        ...validRequiredMovieInputProps,
        posterUrl: "url",
    },
];

export const invalidMovieInputCombinations = [
    // Case 1: passing value different than a string in fields expected to be strings
    {
        ...validAllMovieInputProps,
        title: 1,
    },
    {
        ...validAllMovieInputProps,
        director: 1,
    },
    {
        ...validAllMovieInputProps,
        actors: 1,
    },
    {
        ...validAllMovieInputProps,
        plot: 1,
    },
    {
        ...validAllMovieInputProps,
        posterUrl: 1,
    },
    // Case 2: passing invalid number values in fields expected to be numbers
    {
        ...validAllMovieInputProps,
        year: 1899,
    },
    {
        ...validAllMovieInputProps,
        year: -1,
    },
    {
        ...validAllMovieInputProps,
        year: 1899.5,
    },
    {
        ...validAllMovieInputProps,
        runtime: 0,
    },
    {
        ...validAllMovieInputProps,
        runtime: -1,
    },
    {
        ...validAllMovieInputProps,
        runtime: 0.5,
    },
    // Case 3: passing empty genres array
    {
        ...validAllMovieInputProps,
        genres: [],
    },
];
