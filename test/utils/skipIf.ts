// Shim for vitest describe.skipIf to be able to run mocha and vitest side-by-side
/**
 * Skip a test suite if a condition is met.
 * @param {boolean} condition - The condition to check.
 * @returns {Function} The test suite function.
 */
export const describeSkipIf: (condition: boolean) => Mocha.PendingSuiteFunction =
  (describe as any).skipIf ??
  function describeSkipIf(condition: boolean) {
    return condition ? describe.skip : describe;
  };

/**
 * Skip a test if a condition is met.
 * @param {boolean} condition - The condition to check.
 * @returns {Function} The test function.
 */
export const testSkipIf: (condition: boolean) => Mocha.PendingTestFunction =
  (it as any).skipIf ??
  function testSkipIf(condition: boolean) {
    return condition ? it.skip : it;
  };

export const isJSDOM = /jsdom/.test(window.navigator.userAgent);
export const isOSX = /macintosh/i.test(window.navigator.userAgent);
export const hasTouchSupport =
  typeof window.Touch !== 'undefined' && typeof window.TouchEvent !== 'undefined';
