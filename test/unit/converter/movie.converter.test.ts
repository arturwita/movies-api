import { movieToDbMovieConverter, dbMovieToMovieConverter } from "../../../src/converter";
import { DbMovie, Movie } from "../../../src/dto";

describe("Movie Converter", () => {
    describe("Movie To DbMovie Converter", () => {
        it("Should convert an object of Movie type to an object of DbMovie type", () => {
            // given
            const movie: Movie = {
                id: 1,
                title: "The Imitation Game",
                year: 2014,
                runtime: 114,
                director: "Morten Tyldum",
                genres: ["Biography", "Drama", "Thriller"],
            };

            // when
            const convertedObject = movieToDbMovieConverter(movie);

            // then
            expect(convertedObject).toEqual({
                ...movie,
                year: "2014",
                runtime: "114",
            });
        });
    });

    describe("DbMovie To Movie Converter", () => {
        it("Should convert an object of DbMovie type to an object of Movie type", () => {
            // given
            const dbMovie: DbMovie = {
                id: 1,
                title: "The Imitation Game",
                year: "2014",
                runtime: "114",
                director: "Morten Tyldum",
                genres: ["Biography", "Drama", "Thriller"],
            };

            // when
            const convertedObject = dbMovieToMovieConverter(dbMovie);

            // then
            expect(convertedObject).toEqual({
                ...dbMovie,
                year: 2014,
                runtime: 114,
            });
        });
    });
});
