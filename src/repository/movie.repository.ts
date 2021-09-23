import { writeFileSync, readFileSync } from "fs";
import { random } from "lodash";
import { AppDependencies } from "../dependency-injection/container";
import { DbMovie, Movie } from "../dto/movie.dto";
import { Genre } from "../dto/genre.dto";
import { dbMovieToMovieConverter, movieToDbMovieConverter } from "../converter/movie.converter";
import { checkMoviesEquality, isNumberInRange, Logger } from "../util";
import { Exception } from "../error/exception";
import { HTTP_ERROR_CODE } from "../error/error-codes";

interface FileDatabase {
    genres: Genre[];
    movies: DbMovie[];
}

export class MovieRepository {
    readonly dbPath: string;
    readonly logger: Logger;
    readonly durationOffset: number;

    constructor({ config, logger }: AppDependencies) {
        this.dbPath = config.get("app.dbPath");
        this.durationOffset = config.get("app.durationOffset");
        this.logger = logger;
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

    findMovieByData(givenMovie: Movie): Movie | null {
        const movies = this.getMovies();
        const foundMovie = movies.find(savedMovie => checkMoviesEquality(givenMovie, savedMovie));

        return foundMovie ? foundMovie : null;
    }

    getMoviesInRuntimeRange(movies: Movie[], duration: number): Movie[] {
        return movies.filter(movie => {
            const rangeStart = duration - this.durationOffset;
            const rangeEnd = duration + this.durationOffset;

            return isNumberInRange(movie.runtime, rangeStart, rangeEnd);
        });
    }

    getRandomMovie(duration?: number, getRandomNumber = random): Movie {
        const savedMovies = this.getMovies();
        const moviesToSearchIn = duration ? this.getMoviesInRuntimeRange(savedMovies, duration) : savedMovies;

        if (moviesToSearchIn.length === 0) {
            this.logger.error("No movies found");
            throw new Exception(422, "No movies found", HTTP_ERROR_CODE.UNPROCESSABLE_ENTITY);
        }

        const limit = moviesToSearchIn.length - 1;
        const randomIndex = getRandomNumber(0, limit);

        return moviesToSearchIn[randomIndex];
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
