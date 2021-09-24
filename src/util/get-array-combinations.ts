// This function generates every possible combination of provided array.
// We assume that the order in combination does not matter.

export function getArrayCombinations<T>(array: T[]): T[][] {
    return new Array(1 << array.length)
        .fill(null)
        .map((_item1, i) => array.filter((_item2, j) => i & (1 << j)))
        .filter(array => !!array.length);
}
