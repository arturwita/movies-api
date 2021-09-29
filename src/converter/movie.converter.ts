import { Movie, DbMovie } from "../dto";

export const movieToDbMovieConverter = (movie: Movie): DbMovie => ({
    id: movie.id,
    title: movie.title,
    year: `${movie.year}`,
    runtime: `${movie.runtime}`,
    genres: movie.genres,
    director: movie.director,
    plot: movie.plot,
    actors: movie.actors,
    posterUrl: movie.posterUrl,
});

export const dbMovieToMovieConverter = (dbMovie: DbMovie): Movie => ({
    id: dbMovie.id,
    title: dbMovie.title,
    runtime: Number.parseInt(dbMovie.runtime, 10),
    year: Number.parseInt(dbMovie.year, 10),
    genres: dbMovie.genres,
    director: dbMovie.director,
    plot: dbMovie.plot,
    actors: dbMovie.actors,
    posterUrl: dbMovie.posterUrl,
});
