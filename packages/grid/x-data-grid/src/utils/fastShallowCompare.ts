
const is = Object.is;

export function fastShallowCompare<T extends Record<string, unknown> | null | undefined>(a: T, b: T) {
  if (a === b) return true;
  if (!(a instanceof Object) || !(b instanceof Object)) return false;

  for (let key in a) {
    if (!(key in b))
      return false;
    if (!is(a[key], b[key]))
      return false;
  }

  for (let key in b) {
    if (!(key in a))
      return false;
  }

  return true;
};

