import { isEqual } from "lodash";

export function compareArrays<T>(firstArray: T[], secondArray: T[]): boolean {
    return isEqual(firstArray.sort(), secondArray.sort());
}
