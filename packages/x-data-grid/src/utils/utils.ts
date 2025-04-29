export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isObject<TObject = Record<PropertyKey, any>>(value: unknown): value is TObject {
  return typeof value === 'object' && value !== null;
}

export function localStorageAvailable() {
  try {
    // Incognito mode might reject access to the localStorage for security reasons.
    // window isn't defined on Node.js
    // https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
    const key = '__some_random_key_you_are_not_going_to_use__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    return false;
  }
}

export function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Follows the CSS specification behavior for min and max
 * If min > max, then the min have priority
 */
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * Create an array containing the range [from, to[
 */
export function range(from: number, to: number) {
  return Array.from({ length: to - from }).map((_, i) => from + i);
}

// Pseudo random number. See https://stackoverflow.com/a/47593316
function mulberry32(a: number): () => number {
  return () => {
    /* eslint-disable */
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    /* eslint-enable */
  };
}

/**
 * Create a random number generator from a seed. The seed
 * ensures that the random number generator produces the
 * same sequence of 'random' numbers on every render. It
 * returns a function that generates a random number between
 * a specified min and max.
 */
export function createRandomNumberGenerator(seed: number): (min: number, max: number) => number {
  const random = mulberry32(seed);
  return (min: number, max: number) => min + (max - min) * random();
}

export function deepClone(obj: Record<string, any>) {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Mark a value as used so eslint doesn't complain. Use this instead
 * of a `eslint-disable-next-line react-hooks/exhaustive-deps` because
 * that hint disables checks on all values instead of just one.
 */
export function eslintUseValue(_: any) {}

export const runIf = (condition: boolean, fn: Function) => (params: unknown) => {
  if (condition) {
    fn(params);
  }
};
