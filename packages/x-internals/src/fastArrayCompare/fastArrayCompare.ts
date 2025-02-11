/**
 * A fast array comparison function that compares two arrays for equality.
 *
 * Assumes that the arrays are ordered and contain only primitive values.
 *
 * It is faster than `fastObjectShallowCompare` for arrays.
 *
 * Returns true for instance equality, even if inputs are not arrays.
 *
 * @returns true if arrays contain the same elements in the same order, false otherwise.
 */
export function fastArrayCompare<T extends any>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }

  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  let i = a.length;
  if (i !== b.length) {
    return false;
  }

  // eslint-disable-next-line no-plusplus
  while (i--) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
