import config from "config";
import { join } from "path";
import { readFileSync, writeFileSync } from "fs";
import { Genre, Movie } from "../../../src/dto";
import { FileDatabase } from "../../../src/repository";
import { emptyDb, predefinedGenres } from "../test-payloads";
import { movieToDbMovieConverter, dbMovieToMovieConverter } from "../../../src/converter";

interface ParsedDatabase {
    genres: Genre[];
    movies: Movie[];
}

const filePath = join(process.cwd(), config.get("app.dbPath"));

const readFile = (): FileDatabase => {
    const buffer = readFileSync(filePath);
    return JSON.parse(buffer.toString());
};

export const readDb = (): ParsedDatabase => {
    const { movies, genres } = readFile();
    return {
        genres,
        movies: movies.map(dbMovieToMovieConverter),
    };
};

export const addToDb = (movie: Movie, genres: Genre[] = predefinedGenres): void => {
    const db = readFile();

    const newMovie = movieToDbMovieConverter(movie);
    db.movies.push(newMovie);

    if (genres) {
        db.genres = genres;
    }

    writeFileSync(filePath, JSON.stringify(db, null, 4));
};

export const clearDb = (): void => {
    writeFileSync(filePath, JSON.stringify(emptyDb, null, 4));
};
