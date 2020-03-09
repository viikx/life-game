/**
 * 返回新的二维数组
 * @param {number} col
 * @param {number} row
 * @returns {Array[][]}
 */
function createTwoDimensionalArray(col, row) {
  return new Array(col).fill(null).map(() => new Array(row).fill(0));
}

export { createTwoDimensionalArray };
export { useInterval } from "./customHook";
