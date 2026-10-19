import { areArraysEqual } from '@base-ui/utils/areArraysEqual';

// Unlike `areArraysEqual`, it accepts non-array values and compares items with `===`.
export function fastArrayCompare<T>(a: T, b: T): boolean {
  return (
    a === b ||
    (Array.isArray(a) &&
      Array.isArray(b) &&
      areArraysEqual(a, b, (itemA, itemB) => itemA === itemB))
  );
}
