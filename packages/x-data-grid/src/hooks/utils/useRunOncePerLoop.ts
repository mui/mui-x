'use client';
import * as React from 'react';

export function useRunOncePerLoop<T extends (...args: any[]) => void>(callback: T) {
  const scheduledCallbackRef = React.useRef<(...args: any) => void>(null);

  const schedule = React.useCallback(
    (...args: Parameters<T>) => {
      // for robustness, a fallback in case we don't react to state updates and layoutEffect is not run
      // if we react to state updates, layoutEffect will run before microtasks
      if (!scheduledCallbackRef.current) {
        queueMicrotask(() => {
          if (scheduledCallbackRef.current) {
            scheduledCallbackRef.current();
          }
        });
      }
      scheduledCallbackRef.current = () => {
        scheduledCallbackRef.current = null;
        callback(...args);
      };
    },
    [callback],
  );

  React.useLayoutEffect(() => {
    if (scheduledCallbackRef.current) {
      scheduledCallbackRef.current();
    }
  });

  return {
    schedule,
    cancel: () => {
      if (scheduledCallbackRef.current) {
        scheduledCallbackRef.current = null;
        return true;
      }
      return false;
    },
  };
}
