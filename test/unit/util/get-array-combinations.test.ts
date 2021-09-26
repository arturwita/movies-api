import { getArrayCombinations } from "../../../src/util";

describe("Get Array Combinations", () => {
    it("Should return every possible combination of provided array", () => {
        // given
        const array = [1, 2, 3];

        // when
        const combinations = getArrayCombinations(array);

        // then
        const expectedResult = [[1, 2, 3], [1, 2], [1, 3], [2, 3], [1], [2], [3]];
        expect(combinations).toEqual(expect.arrayContaining(expectedResult));
    });
});
