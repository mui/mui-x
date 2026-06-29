/// <reference path="./core-js-pure.d.ts" />
import CoreJsDisposableStack from 'core-js-pure/actual/disposable-stack/index.js';
import CoreJsAsyncDisposableStack from 'core-js-pure/actual/async-disposable-stack/index.js';

/**
 * Well-known `Symbol.dispose`. Resolves to the native well-known symbol when
 * the runtime ships the explicit resource management proposal; otherwise falls
 * back to `Symbol.for('Symbol.dispose')`, the same registry symbol the
 * `core-js-pure` ponyfill uses, so `DisposableStack#use` finds the method.
 *
 * Consumers should key dispose methods on this constant —
 * `class Foo { [disposeSymbol]() {} }` — rather than `Symbol.dispose`, so the
 * class works on runtimes without the proposal.
 */
export const disposeSymbol: typeof Symbol.dispose =
  typeof Symbol.dispose === 'symbol'
    ? Symbol.dispose
    : (Symbol.for('Symbol.dispose') as typeof Symbol.dispose);

/**
 * Well-known `Symbol.asyncDispose`. See {@link disposeSymbol} for the
 * native/fallback resolution rules.
 */
export const asyncDisposeSymbol: typeof Symbol.asyncDispose =
  typeof Symbol.asyncDispose === 'symbol'
    ? Symbol.asyncDispose
    : (Symbol.for('Symbol.asyncDispose') as typeof Symbol.asyncDispose);

/**
 * Spec-compliant `DisposableStack`. Prefers the platform's native class when
 * present; falls back to the `core-js-pure` ponyfill otherwise.
 */
export const DisposableStack: typeof globalThis.DisposableStack =
  globalThis.DisposableStack ?? (CoreJsDisposableStack as typeof globalThis.DisposableStack);

/**
 * Spec-compliant `AsyncDisposableStack`. Prefers the platform's native class
 * when present; falls back to the `core-js-pure` ponyfill otherwise.
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
