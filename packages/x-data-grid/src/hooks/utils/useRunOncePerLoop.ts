import * as React from 'react';

const defaultGetScopeKey = () => 'default';

export function useRunOncePerLoop<T extends (...args: any[]) => void>(
  callback: T,
  nextFrame: boolean = false,
  // Use scopeKey to schedule independent instances of the same callback depending on the arguments
  getScopeKey: (...args: Parameters<T>) => string = defaultGetScopeKey,
) {
  const scheduledRef = React.useRef(new Map<string, boolean>());

  const schedule = React.useCallback(
    (...args: Parameters<T>) => {
      const scopeKey = getScopeKey(...args);
      if (scheduledRef.current.get(scopeKey)) {
        return;
      }
      scheduledRef.current.set(scopeKey, true);

      const runner = () => {
        scheduledRef.current.delete(scopeKey);
        callback(...args);
      };

      if (nextFrame) {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(runner);
        }
        return;
      }

      if (typeof queueMicrotask === 'function') {
        queueMicrotask(runner);
      } else {
        Promise.resolve().then(runner);
      }
    },
    [callback, nextFrame, getScopeKey],
  );

  return schedule;
}
