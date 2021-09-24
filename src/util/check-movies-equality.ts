import { isEqual } from "lodash";
import { Movie } from "../dto";

export const checkMoviesEquality = (firstMovie: Movie, secondMovie: Movie): boolean =>
    isEqual(
        {
            title: firstMovie.title,
            year: firstMovie.year,
            runtime: firstMovie.runtime,
            director: firstMovie.director,
            genres: firstMovie.genres.sort(),
        },
        {
            title: secondMovie.title,
            year: secondMovie.year,
            runtime: secondMovie.runtime,
            director: secondMovie.director,
            genres: secondMovie.genres.sort(),
        }
    );
