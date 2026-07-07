/**
 * Finds the index of `value` inside `data`.
 *
 * Unlike `Array.prototype.indexOf`, this also matches values that are equal but not the same
 * reference, which matters for axes keyed by `Date` or other objects: the highlighted `value`
 * coming from pointer/keyboard interaction is not guaranteed to be the exact same object
 * instance as the corresponding entry in `data`.
 *
 * Only used as a fallback when the caller does not already have a resolved `dataIndex`.
 */
export function findDataIndex(data: readonly unknown[], value: unknown): number {
  if (value instanceof Date) {
    const time = value.getTime();
    return data.findIndex((item) => item instanceof Date && item.getTime() === time);
  }

  return data.indexOf(value);
}
