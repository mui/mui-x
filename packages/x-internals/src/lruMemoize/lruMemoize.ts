type EqualityFn = (a: any, b: any) => boolean;

export interface LruMemoizeOptions {
  /**
   * Function used to compare each new argument against the cached one.
   * @default (a, b) => a === b
   */
  equalityCheck?: EqualityFn;
  /**
   * When provided and a new result is computed, the cache is searched for a result
   * considered equal by this function. If found, the cached value is returned instead,
   * preserving referential stability.
   */
  resultEqualityCheck?: EqualityFn;
  /**
   * The number of previous calls to keep in the cache.
   * @default 1
   */
  maxSize?: number;
}

interface CacheEntry {
  args: any[];
  value: any;
}

const referenceEqualityCheck: EqualityFn = (a, b) => a === b;

/**
 * Memoizes a function using a least-recently-used cache.
 * The arguments of the last `maxSize` calls are compared with the provided `equalityCheck`.
 *
 * Drop-in replacement for the subset of `lruMemoize` from `reselect` that MUI X relies on.
 */
export function lruMemoize<F extends (...args: any[]) => any>(
  func: F,
  equalityCheckOrOptions?: EqualityFn | LruMemoizeOptions,
): F {
  const options: LruMemoizeOptions =
    typeof equalityCheckOrOptions === 'object'
      ? equalityCheckOrOptions
      : { equalityCheck: equalityCheckOrOptions };
  const { equalityCheck = referenceEqualityCheck, maxSize = 1, resultEqualityCheck } = options;

  let entries: CacheEntry[] = [];

  const areArgsEqual = (cachedArgs: any[], args: any[]) => {
    if (cachedArgs.length !== args.length) {
      return false;
    }
    for (let i = 0; i < args.length; i += 1) {
      if (!equalityCheck(cachedArgs[i], args[i])) {
        return false;
      }
    }
    return true;
  };

  function memoized(...args: any[]) {
    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      if (areArgsEqual(entry.args, args)) {
        if (i > 0) {
          // Move the hit to the front of the cache
          entries.splice(i, 1);
          entries.unshift(entry);
        }
        return entry.value;
      }
    }

    let value = func(...args);
    if (resultEqualityCheck) {
      const matchingEntry = entries.find((entry) => resultEqualityCheck(entry.value, value));
      if (matchingEntry) {
        value = matchingEntry.value;
      }
    }

    entries.unshift({ args, value });
    if (entries.length > maxSize) {
      entries.pop();
    }
    return value;
  }

  memoized.clearCache = () => {
    entries = [];
  };

  return memoized as unknown as F;
}
