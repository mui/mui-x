/**
 * Returns true if the two paths are equivalent. Independent of the format of the paths.
 *
 * @param {string | string[] | undefined} a original path.
 * @param {string | string[] | undefined} b path to compare to.
 * @returns {boolean} true if the two paths are equivalent.
 */
export const isPathEqual = (
  a: string | string[] | undefined,
  b: string | string[] | undefined,
): boolean => {
  if (!a || !b) {
    return false;
  }

  if (Array.isArray(a)) {
    a = a.join('.');
  }
  if (Array.isArray(b)) {
    b = b.join('.');
  }
  return a === b;
};
