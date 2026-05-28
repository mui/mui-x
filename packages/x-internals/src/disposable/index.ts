/// <reference path="./core-js-pure.d.ts" />
import CoreJsDisposableStack from 'core-js-pure/actual/disposable-stack';
import CoreJsAsyncDisposableStack from 'core-js-pure/actual/async-disposable-stack';

// Ensure `Symbol.dispose` / `Symbol.asyncDispose` exist on the global `Symbol`
// so that classes declaring `[Symbol.dispose]() {}` key their methods on the
// well-known symbol — without this, on runtimes that don't yet ship the
// explicit resource management proposal the method ends up keyed on the
// string "undefined" and the `using` syntax can't find it. Uses `Symbol.for`
// so we share the registry symbol with core-js-pure's own fallback path.
if (typeof Symbol.dispose !== 'symbol') {
  Object.defineProperty(Symbol, 'dispose', {
    value: Symbol.for('Symbol.dispose'),
    configurable: true,
  });
}
if (typeof Symbol.asyncDispose !== 'symbol') {
  Object.defineProperty(Symbol, 'asyncDispose', {
    value: Symbol.for('Symbol.asyncDispose'),
    configurable: true,
  });
}

/**
 * Spec-compliant `DisposableStack`. Importing this module is a side effect:
 * it patches `Symbol.dispose` / `Symbol.asyncDispose` onto the global `Symbol`
 * so that `[Symbol.dispose]() {}` class syntax works at definition time.
 *
 * Prefers the platform's native class when present; falls back to the
 * `core-js-pure` ponyfill otherwise.
 */
export const DisposableStack: typeof globalThis.DisposableStack =
  globalThis.DisposableStack ?? (CoreJsDisposableStack as typeof globalThis.DisposableStack);

/**
 * Spec-compliant `AsyncDisposableStack`. See {@link DisposableStack} for the
 * import-time side effects on `Symbol.asyncDispose`.
 */
export const AsyncDisposableStack: typeof globalThis.AsyncDisposableStack =
  globalThis.AsyncDisposableStack ??
  (CoreJsAsyncDisposableStack as typeof globalThis.AsyncDisposableStack);

/**
 * Unwraps a `SuppressedError` chain (as produced by `DisposableStack.dispose()`
 * when multiple disposers throw) into a flat list, outermost failure first.
 * Returns `[error]` unchanged if it isn't a `SuppressedError`.
 */
export function unwrapSuppressedErrors(error: unknown): unknown[] {
  const failures: unknown[] = [];
  let current: unknown = error;
  while (
    typeof current === 'object' &&
    current !== null &&
    'error' in current &&
    'suppressed' in current
  ) {
    failures.push((current as { error: unknown }).error);
    current = (current as { suppressed: unknown }).suppressed;
  }
  failures.push(current);
  return failures;
}
