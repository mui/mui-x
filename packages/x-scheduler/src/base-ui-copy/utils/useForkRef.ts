import * as React from 'react';

/**
 * Merges refs into a single memoized callback ref or `null`.
 */
export function useForkRef<Instance>(
  ...refs: Array<React.Ref<Instance> | undefined>
): null | React.RefCallback<Instance> {
  const cleanupRef = React.useRef<void | (() => void)>(undefined);

  const refEffect = React.useCallback((instance: Instance | null) => {
    const cleanups = refs.map((ref) => {
      if (ref == null) {
        return null;
      }

      if (typeof ref === 'function') {
        const refCallback = ref;
        const refCleanup: void | (() => void) = refCallback(instance);
        return typeof refCleanup === 'function'
          ? refCleanup
          : () => {
              refCallback(null);
            };
      }

      (ref as React.RefObject<Instance | null>).current = instance;
      return () => {
        (ref as React.RefObject<Instance | null>).current = null;
      };
    });

    return () => {
      cleanups.forEach((refCleanup) => refCleanup?.());
    };
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);

  return React.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (value) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        (cleanupRef as React.RefObject<void | (() => void)>).current = undefined;
      }

      if (value != null) {
        (cleanupRef as React.RefObject<void | (() => void)>).current = refEffect(value);
      }
    };
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
