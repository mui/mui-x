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
