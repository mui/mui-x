'use client';
import * as React from 'react';

export function useRunOncePerLoop<T extends (...args: any[]) => void>(callback: T) {
  const scheduledCallbackRef = React.useRef<(...args: any) => void>(null);

  const schedule = React.useCallback(
    (...args: Parameters<T>) => {
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
      scheduledCallbackRef.current = null;
    },
  };
}
