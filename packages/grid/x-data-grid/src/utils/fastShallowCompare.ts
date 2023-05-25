const is = Object.is;

export function fastShallowCompare<T extends Record<string, any> | null>(
  a: T,
  b: T,
) {
  if (a === b) {
    return true;
  }
  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable guard-for-in */
  for (const key in a) {
    if (!(key in b)) {
      return false;
    }
    if (!is(a[key], b[key])) {
      return false;
    }
  }

  for (const key in b) {
    if (!(key in a)) {
      return false;
    }
  }
  /* eslint-enable no-restricted-syntax */
  /* eslint-enable guard-for-in */

  return true;
}
