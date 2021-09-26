import each from "jest-each";
import { isNumberInRange } from "../../../src/util";

describe("Is Number In Range", () => {
    const rangeStart = 0;
    const rangeEnd = 2;

    each([0, 1, 2]).it("Should return true if number is in range", _number => {
        // when
        const isInRange = isNumberInRange(_number, rangeStart, rangeEnd);

        // then
        expect(isInRange).toBe(true);
    });

    it("Should return false if number is in not range", () => {
        // given
        const _number = 3;

        // when
        const isInRange = isNumberInRange(_number, rangeStart, rangeEnd);

        // then
        expect(isInRange).toBe(false);
    });
});
