import { join } from "path";
import { writeFileSync, readFileSync } from "fs";
import { random, orderBy } from "lodash";
import { AppDependencies } from "../dependency-injection";
import { DbMovie, Genre, Movie } from "../dto";
import { dbMovieToMovieConverter, movieToDbMovieConverter } from "../converter";
import { getArrayCombinations, compareArrays, checkMoviesEquality, isNumberInRange } from "../util";

export interface FileDatabase {
    genres: Genre[];
    movies: DbMovie[];
}

export class MovieRepository {
    readonly dbPath: string;
    readonly durationOffset: number;

    constructor({ config }: AppDependencies) {
        const { dbPath, durationOffset } = config.get("app");

        this.dbPath = join(process.cwd(), dbPath);
        this.durationOffset = durationOffset;
    }

    private readDbFile(): FileDatabase {
        const buffer = readFileSync(this.dbPath);
        return JSON.parse(buffer.toString());
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

    getRandomMovie(getRandomNumber = random, duration?: number): Movie | null {
        const savedMovies = this.getMovies();
        const moviesToSearchIn = duration ? this.getMoviesInRuntimeRange(savedMovies, duration) : savedMovies;

        if (moviesToSearchIn.length === 0) {
            return null;
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
