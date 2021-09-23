import { writeFileSync, readFileSync } from "fs";
import { AppDependencies } from "../dependency-injection/container";
import { Movie } from "../dto/movie.dto";
import { Genre } from "../dto/genre.dto";

interface FileDatabase {
    genres: Genre[];
    movies: Movie[];
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
        return movies;
    }

    saveMovie(movie: Movie): Movie {
        // TODO: it saves runtime and year as numbers instead of strings
        const db = this.readDbFile();
        db.movies.push(movie);

        const updatedDb = JSON.stringify(db, null, 4);
        writeFileSync(this.dbPath, updatedDb);

        return movie;
    }
}
