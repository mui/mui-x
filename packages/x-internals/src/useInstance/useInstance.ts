'use client';
import * as React from 'react';
import { useOnMount } from '@base-ui/utils/useOnMount';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';

interface Disposable {
  /**
   * `useEffect`-style mount hook: invoked once on mount.
   * @returns {() => void} a cleanup function that disposes the instance synchronously.
   */
  disposeEffect: () => () => void;
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
  (
    React as unknown as {
      __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: ReactSharedInternalsLike;
    }
  ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ??
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
    return (owner.mode & STRICT_MODE_BITS) !== 0;
  } catch {
    return false;
  }
}

/**
 * Production variant: lazily creates the instance on first render and wires
 * `disposeEffect` to the mount/unmount lifecycle. No StrictMode detection is
 * needed because StrictMode's double-mount only happens in development.
 */
function useInstanceProduction<T extends Disposable>(factory: () => T): T {
  const instance = useRefWithInit(factory).current;
  useOnMount(instance.disposeEffect);
  return instance;
}

/**
 * Development variant: detects StrictMode by reading the currently-rendering
 * fiber's `mode` bits from React shared internals and skips the cleanup when
 * set, so a single instance survives StrictMode's mount→unmount→mount cycle.
 * Dev-only trade-off: a real unmount inside `<StrictMode>` also skips dispose.
 */
function useInstanceDevelopment<T extends Disposable>(factory: () => T): T {
  const instance = useRefWithInit(factory).current;
  // Captured during render because the owner fiber is only set while React
  // is rendering — by the time the effect runs it's already null.
  const strictModeRef = useRefWithInit(isInStrictMode);
  useOnMount(() => {
    const cleanup = instance.disposeEffect();
    return strictModeRef.current ? undefined : cleanup;
  });
  return instance;
}

/**
 * Lazily creates an instance on first render and runs `instance.disposeEffect`
 * once on mount. The returned cleanup runs synchronously on unmount.
 */
export const useInstance =
  process.env.NODE_ENV === 'production' ? useInstanceProduction : useInstanceDevelopment;
