import { FileDatabase } from "../../src/repository";
import { Genre, Movie, MovieInput, QueryParams } from "../../src/dto";

export const predefinedGenres: Genre[] = ["Biography", "Drama", "Thriller"];

export const emptyDb: FileDatabase = {
    genres: predefinedGenres,
    movies: [],
};

export const defaultMovieInput: MovieInput = {
    title: "The Imitation Game",
    year: 2014,
    runtime: 114,
    genres: ["Biography", "Drama", "Thriller"],
    director: "Morten Tyldum",
    actors: "Benedict Cumberbatch, Keira Knightley, Matthew Goode, Rory Kinnear",
    plot: "During World War II, mathematician Alan Turing tries to crack the enigma code with help from fellow mathematicians.",
    posterUrl:
        "https://images-na.ssl-images-amazon.com/images/M/MV5BNDkwNTEyMzkzNl5BMl5BanBnXkFtZTgwNTAwNzk3MjE@._V1_SX300.jpg",
};

export const defaultMovie: Movie = {
    id: 115,
    ...defaultMovieInput,
};

export const longMovie: Movie = {
    id: 1,
    ...defaultMovieInput,
    runtime: 114,
};

export const shortMovie: Movie = {
    id: 2,
    ...defaultMovieInput,
    runtime: 86,
};

export const biographyDramaMovie: Movie = {
    id: 1,
    ...defaultMovieInput,
    genres: ["Biography", "Drama"],
};

export const shortBiographyDramaMovie: Movie = {
    ...biographyDramaMovie,
    runtime: 86,
};

export const dramaMovie: Movie = {
    id: 2,
    ...defaultMovieInput,
    genres: ["Drama"],
};

export const shortDramaMovie: Movie = {
    ...dramaMovie,
    runtime: 86,
};

export const biographyMovie: Movie = {
    id: 3,
    ...defaultMovieInput,
    genres: ["Biography"],
};

export const longBiographyMovie: Movie = {
    ...biographyMovie,
    runtime: 114,
};

export const comedyCrimeMovie: Movie = {
    id: 4,
    ...defaultMovieInput,
    genres: ["Comedy", "Crime"],
};

export const noMoviesInDbErrorCases: QueryParams[] = [
    // Case 1: no params were provided
    {},
    // Case 2: duration was provided
    { duration: "114" },
];
