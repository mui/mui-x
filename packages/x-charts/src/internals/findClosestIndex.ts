import { getAsNumber } from './getAsNumber';

/**
 * Returns the index of the entry in `axisData` whose numeric value is closest
 * to `valueAsNumber`. Returns -1 if `axisData` is empty.
 */
export function findClosestIndex(axisData: readonly any[], valueAsNumber: number): number {
  return axisData.findIndex((pointValue, index) => {
    const v = getAsNumber(pointValue);
    if (v > valueAsNumber) {
      if (
        index === 0 ||
        Math.abs(valueAsNumber - v) <= Math.abs(valueAsNumber - getAsNumber(axisData[index - 1]))
      ) {
        return true;
      }
    }
    if (v <= valueAsNumber) {
      if (
        index === axisData.length - 1 ||
        Math.abs(valueAsNumber - v) < Math.abs(valueAsNumber - getAsNumber(axisData[index + 1]))
      ) {
        return true;
      }
    }
    return false;
  });
}
