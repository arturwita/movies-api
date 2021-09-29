import { compareArrays } from "../../../src/util";

describe("Compare Arrays", () => {
    it("Should return true if arrays contain exactly the same elements", () => {
        // given
        const firstArray = [1, 2, 3, 4];
        const secondArray = [4, 3, 2, 1];

        // when
        const areEqual = compareArrays(firstArray, secondArray);

        // then
        expect(areEqual).toBe(true);
    });

    it("Should return false if arrays contain different elements", () => {
        // given
        const firstArray = [1, 2, 3, 4];
        const secondArray = [5, 6, 7, 8];

        // when
        const areEqual = compareArrays(firstArray, secondArray);

        // then
        expect(areEqual).toBe(false);
    });
});
