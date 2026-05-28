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

/**
 * Production variant: lazily creates the instance on first render and wires
 * `disposeEffect` to the mount/unmount lifecycle. No StrictMode detection is
 * needed because StrictMode's double-mount only happens in development.
 * @returns {T} the lazily-created instance.
 */
function useInstanceProduction<T extends Disposable>(factory: () => T): T {
  const instance = useRefWithInit(factory).current;
  useOnMount(instance.disposeEffect);
  return instance;
}

/**
 * Development variant: detects StrictMode by counting how many times React
 * calls a `useState` lazy initializer on the first render. StrictMode dev
 * double-invokes lazy initializers (documented React behavior), so two calls
 * means the mount→unmount→mount cycle is active and we must skip the cleanup
 * to keep the same instance alive across it. Dev-only trade-off: a real
 * unmount under `<StrictMode>` will also skip dispose.
 * @returns {T} the lazily-created instance.
 */
function useInstanceDevelopment<T extends Disposable>(factory: () => T): T {
  const instance = useRefWithInit(factory).current;

  const doubleInvokedRef = React.useRef<boolean | null>(false);
  React.useState(() => {
    if (doubleInvokedRef.current === false) {
      doubleInvokedRef.current = null;
    } else {
      doubleInvokedRef.current = true;
    }
    return null;
  });

  useOnMount(() => {
    const cleanup = instance.disposeEffect();
    if (doubleInvokedRef.current === true) {
      return undefined;
    }
    return cleanup;
  });

  return instance;
}

/**
 * Lazily creates an instance on first render and runs `instance.disposeEffect`
 * once on mount. The returned cleanup runs synchronously on unmount.
 */
export const useInstance =
  process.env.NODE_ENV === 'production' ? useInstanceProduction : useInstanceDevelopment;
