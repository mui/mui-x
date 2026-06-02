'use client';
import * as React from 'react';
import '../disposable';
import { useOnMount } from '@base-ui/utils/useOnMount';

interface Disposable {
  [Symbol.dispose](): void;
}

// React 19 exposes shared internals under `__CLIENT_INTERNALS_…` with the
// fiber under `A.getOwner()`; React 18 exposes them under `__SECRET_INTERNALS_…`
// with the fiber under `ReactCurrentOwner.current`. `mode` is a bitfield on
// the fiber; StrictLegacyMode (8) and StrictEffectsMode (16) together cover
// both `<StrictMode>` flavors.
const STRICT_MODE_BITS = 0b11000;

interface ReactSharedInternalsLike {
  A?: { getOwner?: () => { mode?: number } | null } | null;
  ReactCurrentOwner?: { current?: { mode?: number } | null } | null;
}

const ReactInternals: ReactSharedInternalsLike | undefined =
  // eslint-disable-next-line no-underscore-dangle
  (
    React as unknown as {
      __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: ReactSharedInternalsLike;
    }
  ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ??
  // eslint-disable-next-line no-underscore-dangle
  (
    React as unknown as {
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: ReactSharedInternalsLike;
    }
  ).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

function isInStrictMode(): boolean {
  try {
    const owner =
      ReactInternals?.A?.getOwner?.() ?? ReactInternals?.ReactCurrentOwner?.current ?? null;
    if (owner == null || typeof owner.mode !== 'number') {
      return false;
    }
    // eslint-disable-next-line no-bitwise
    return (owner.mode & STRICT_MODE_BITS) !== 0;
  } catch {
    return false;
  }
}

// Module-private symbol used to stash the `useOnMount` callback on the
// instance during the first render so subsequent renders can pass the same
// reference into `useOnMount` without allocating a fresh closure.
const MOUNT = Symbol('useDisposable.mount');

type Mounted<T> = T & { [MOUNT]: () => (() => void) | undefined };

const NOOP_MOUNT = () => undefined;

const UNINITIALIZED: unique symbol = Symbol();

/**
 * Production variant: lazily creates the instance on first render and stashes
 * a single mount/cleanup pair on it under a module-private symbol so render-
 * pass allocations stay at zero after the first render. No StrictMode
 * detection is needed because StrictMode's double-mount only happens in dev.
 * @returns {T} the lazily-created instance.
 */
function useDisposableProduction<T extends Disposable>(factory: () => T): T {
  const ref = React.useRef<Mounted<T> | typeof UNINITIALIZED>(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    const inst = factory() as Mounted<T>;
    const cleanup = () => inst[Symbol.dispose]();
    inst[MOUNT] = () => cleanup;
    ref.current = inst;
  }
  useOnMount(ref.current[MOUNT]);
  return ref.current;
}

/**
 * Development variant: detects StrictMode by reading the currently-rendering
 * fiber's `mode` bits from React shared internals and stashes a no-op mount
 * callback when set, so a single instance survives StrictMode's mount→
 * unmount→mount cycle. Dev-only trade-off: a real unmount inside
 * `<StrictMode>` also skips dispose.
 * @returns {T} the lazily-created instance.
 */
function useDisposableDevelopment<T extends Disposable>(factory: () => T): T {
  const ref = React.useRef<Mounted<T> | typeof UNINITIALIZED>(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    const inst = factory() as Mounted<T>;
    // Captured during render because the owner fiber is only set while React
    // is rendering — by the time the effect runs it's already null.
    if (isInStrictMode()) {
      inst[MOUNT] = NOOP_MOUNT;
    } else {
      const cleanup = () => inst[Symbol.dispose]();
      inst[MOUNT] = () => cleanup;
    }
    ref.current = inst;
  }
  useOnMount(ref.current[MOUNT]);
  return ref.current;
}

/**
 * Lazily creates an instance on first render and runs its `[Symbol.dispose]`
 * once on unmount. The cleanup runs synchronously; in development StrictMode's
 * simulated unmount is detected and skipped so the same instance survives the
 * double mount.
 */
export const useDisposable =
  process.env.NODE_ENV === 'production' ? useDisposableProduction : useDisposableDevelopment;
