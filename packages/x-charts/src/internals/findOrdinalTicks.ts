export function findOrdinalTicks<T extends { toString(): string }>(
  /**
   * The data array to find ticks in.
   */
  data: T[],
  /**
   * The start index of the range to find ticks in.
   * This index is excluded in the range.
   */
  startIndex: number,
  /**
   * The end index of the range to find ticks in.
   * This index is included in the range.
   */
  endIndex: number,
  /**
   * A function to estimate the number of ticks between two dates.
   */
  getTickNumber: (start: Date, end: Date) => number,
  /**
   * A function to determine if a value is a tick based on the previous value.
   */
  isTick: (prev: Date, value: Date) => boolean,
): number[] {
  if (endIndex <= startIndex) {
    return [];
  }
  const startValue = data[startIndex];
  const endValue = data[endIndex];

  if (!(startValue instanceof Date) || !(endValue instanceof Date)) {
    // If at least one of the value is not a date, we can't estimate the number of ticks, so we try again with different values.
    return findOrdinalTicks(
      data,
      startValue instanceof Date ? startIndex : startIndex + 1,
      endValue instanceof Date ? endIndex : endIndex - 1,
      getTickNumber,
      isTick,
    );
  }

  if (endIndex === startIndex + 1) {
    return isTick(startValue, endValue) ? [endIndex] : [];
  }

  let estimatedTickCount = getTickNumber(startValue, endValue);
  if (estimatedTickCount === 0) {
    if (!isTick(startValue, endValue)) {
      return [];
    }
    estimatedTickCount = 1;
  }

  const tickIndexes: number[] = [];
  const step = (endIndex - startIndex) / (estimatedTickCount + 1);

  if (step < 3) {
    // So many ticks that we can check them one by one.
    return data
      .slice(startIndex + 1, endIndex + 1)
      .map((_, index) => startIndex + 1 + index)
      .filter((index) => {
        const prevValue = data[index - 1];
        const currentValue = data[index];

        return (
          prevValue instanceof Date &&
          currentValue instanceof Date &&
          isTick(prevValue, currentValue)
        );
      });
  }

  for (let i = 0; i <= estimatedTickCount; i += 1) {
    const stepStartIndex = Math.round(startIndex + i * step);
    const stepEndIndex = Math.min(Math.round(startIndex + (i + 1) * step), endIndex);

    findOrdinalTicks(data, stepStartIndex, stepEndIndex, getTickNumber, isTick).map((index) =>
      tickIndexes.push(index),
    );
  }

  return tickIndexes;
}
