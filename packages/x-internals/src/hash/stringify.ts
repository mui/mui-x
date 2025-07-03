/**
 * A JSON.stringify that handles circular references safely.
 * Fixes: https://github.com/mui/mui-x/issues/17521
 * Source: https://www.30secondsofcode.org/js/s/stringify-circular-json/
 */
export function stringify(input: object | string | number | null) {
  const seen = new WeakSet();
  return JSON.stringify(input, (_, v) => {
    // https://github.com/mui/mui-x/issues/17855
    if (
      (typeof window !== 'undefined' && v === window) ||
      (typeof document !== 'undefined' && v === document)
    ) {
      return v.toString();
    }
    if (v !== null && typeof v === 'object') {
      if (seen.has(v)) {
        return null;
      }
      seen.add(v);
    }
    return v;
  });
}
