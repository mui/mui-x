import * as React from 'react';
import { isDeepEqual } from '../isDeepEqual';

/**
 * Like `useMemo`, but using deep comparison.
 * Useful when you want to avoid re-renders when an object or array is passed as prop.
 *
 * It doesn't use JSON.stringify internally, so it works with functions, dates, maps, sets, etc.
 *
 * @param obj The object to memoize
 * @returns The memoized object
 */
export function useMemoObject<T>(obj: T): T {
  const ref = React.useRef<T>(obj);

  if (!isDeepEqual(ref.current, obj)) {
    ref.current = obj;
  }

  return ref.current;
}
