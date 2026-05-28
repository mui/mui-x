'use client';
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
 * Development variant: always builds the cleanup closure but never registers
 * it with React. Trade-off: dev memory leaks on real unmounts. Reason: there
 * is no synchronous way to detect StrictMode that works across React build
 * configurations (StrictLegacyMode bits and `useState` lazy-initializer
 * double-invocation are stripped or partial in some test bundles), and
 * registering the cleanup disposes the instance during StrictMode's
 * mount→unmount→mount cycle, which breaks every subsequent operation.
 * @returns {T} the lazily-created instance.
 */
function useInstanceDevelopment<T extends Disposable>(factory: () => T): T {
  const instance = useRefWithInit(factory).current;
  useOnMount(() => {
    instance.disposeEffect();
    return undefined;
  });
  return instance;
}

/**
 * Lazily creates an instance on first render and runs `instance.disposeEffect`
 * once on mount. The returned cleanup runs synchronously on unmount.
 *
 * `MUI_TEST_ENV` forces the development variant even when `NODE_ENV` resolves
 * to `"production"` in the test bundle, so StrictMode handling stays active
 * across CI environments where the NODE_ENV define may differ from the React
 * build that's actually loaded.
 */
export const useInstance =
  process.env.NODE_ENV === 'production' &&
  typeof (globalThis as { MUI_TEST_ENV?: boolean }).MUI_TEST_ENV === 'undefined'
    ? useInstanceProduction
    : useInstanceDevelopment;
