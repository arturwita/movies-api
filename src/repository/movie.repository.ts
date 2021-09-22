import { ContainerDependencies } from "../dependency-injection/container";
import { Movie } from "../dto/movie.dto";
import { Genre } from "../dto/genre.dto";

interface FileDatabase {
    genres: Genre[];
    movies: Movie[];
}

export class MovieRepository {
    private db: FileDatabase;

    constructor({ config }: ContainerDependencies) {
        const { dbPath } = config.get("app");
        this.db = require(dbPath);
    }

    getGenres(): Genre[] {
        return this.db.genres;
    }

    getMovies(): Movie[] {
        return this.db.movies;
    }
}
