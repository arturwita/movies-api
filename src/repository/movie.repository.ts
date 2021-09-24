import { writeFileSync, readFileSync } from "fs";
import { random, orderBy } from "lodash";
import { AppDependencies } from "../dependency-injection";
import { DbMovie, Genre, Movie } from "../dto";
import { dbMovieToMovieConverter, movieToDbMovieConverter } from "../converter";
import { getArrayCombinations, compareArrays, checkMoviesEquality, isNumberInRange, Logger } from "../util";
import { Exception, HTTP_ERROR_CODE } from "../error";

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

    getMoviesMatchingGenres(genres: Genre[]): Movie[] {
        const savedMovies = this.getMovies();
        const genreCombinations = getArrayCombinations<Genre>(genres);

        const matchingMovies = genreCombinations
            .map(genreCombination =>
                savedMovies.filter(savedMovie => compareArrays(savedMovie.genres, genreCombination))
            )
            .flat();

        return orderBy(matchingMovies, "genres.length", "desc");
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
