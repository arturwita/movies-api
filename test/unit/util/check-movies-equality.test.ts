import each from "jest-each";
import { checkMoviesEquality } from "../../../src/util";
import { Movie } from "../../../src/dto";

describe("Check Movies Equality", () => {
    const movieSchema: Movie = {
        id: 1,
        title: "The Imitation Game",
        year: 2014,
        runtime: 114,
        director: "Morten Tyldum",
        genres: ["Biography", "Drama", "Thriller"],
    };
    const differentMovieCombinations = [
        { ...movieSchema, id: 2, title: "different title" },
        { ...movieSchema, id: 2, year: 1 },
        { ...movieSchema, id: 2, runtime: 1 },
        { ...movieSchema, id: 2, director: "different director" },
        { ...movieSchema, id: 2, genres: ["different", "genres"] },
    ];

    it("Should return true if movies are equal", () => {
        // given
        const secondMovie: Movie = {
            ...movieSchema,
            id: 2,
            genres: ["Thriller", "Biography", "Drama"], // we need to make sure that genres order does not matter
        };

        // when
        const areEqual = checkMoviesEquality(movieSchema, secondMovie);

        // then
        expect(areEqual).toBe(true);
    });

    each(differentMovieCombinations).it("Should return false if movies are not equal", differentMovie => {
        // when
        const areEqual = checkMoviesEquality(movieSchema, differentMovie);

        // then
        expect(areEqual).toBe(false);
    });
});
