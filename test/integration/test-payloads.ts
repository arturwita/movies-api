import { FileDatabase } from "../../src/repository";
import { Genre, Movie, MovieInput } from "../../src/dto";

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
