import { Movie, DbMovie } from "../dto";

export const movieToDbMovieConverter = (movie: Movie): DbMovie => ({
    ...movie,
    runtime: `${movie.runtime}`,
    year: `${movie.year}`,
});

export const dbMovieToMovieConverter = (dbMovie: DbMovie): Movie => ({
    ...dbMovie,
    runtime: Number.parseInt(dbMovie.runtime, 10),
    year: Number.parseInt(dbMovie.year, 10),
});
