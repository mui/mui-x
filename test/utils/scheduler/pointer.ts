/**
 * Builds a `window.matchMedia` stub that resolves `(pointer: coarse)` (and any other query) to
 * `matches`, so tests can force `isCoarsePointer()` down either branch.
 *
 * Assign the result to `window.matchMedia` (and restore the original in `afterEach`) before
 * rendering — the scheduler reads pointer type synchronously, not reactively.
 *
 * @example
 * const originalMatchMedia = window.matchMedia;
 * afterEach(() => {
 *   window.matchMedia = originalMatchMedia;
 * });
 * window.matchMedia = createMatchMedia(true); // coarse pointer
 */
export const createMatchMedia = (matches: boolean) => () =>
  ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as any;
