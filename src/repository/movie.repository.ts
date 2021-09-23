import { writeFileSync, readFileSync } from "fs";
import { AppDependencies } from "../dependency-injection/container";
import { DbMovie, Movie } from "../dto/movie.dto";
import { Genre } from "../dto/genre.dto";
import { dbMovieToMovieConverter, movieToDbMovieConverter } from "../converter/movie.converter";

interface FileDatabase {
    genres: Genre[];
    movies: DbMovie[];
}

export class MovieRepository {
    readonly dbPath: string;

    constructor({ config }: AppDependencies) {
        this.dbPath = config.get("app.dbPath");
    }

    private readDbFile(): FileDatabase {
        const buffer = readFileSync(this.dbPath);
        return JSON.parse(buffer.toString());
    }

    getGenres(): Genre[] {
        const { genres } = this.readDbFile();
        return genres;
    }

    getMovies(): Movie[] {
        const { movies } = this.readDbFile();
        return movies.map(movie => dbMovieToMovieConverter(movie));
    }

    saveMovie(movie: Movie): Movie {
        const db = this.readDbFile();

        const dbMovie = movieToDbMovieConverter(movie);
        db.movies.push(dbMovie);

        const updatedDb = JSON.stringify(db, null, 4);
        writeFileSync(this.dbPath, updatedDb);

        return movie;
    }
}
