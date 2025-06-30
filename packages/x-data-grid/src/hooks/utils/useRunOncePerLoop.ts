import * as React from 'react';
import { isJSDOM } from '../../utils/isJSDOM';

export function useRunOncePerLoop<T extends (...args: any[]) => void>(
  callback: T,
  nextFrame: boolean = false,
) {
  const scheduledRef = React.useRef(false);

  const schedule = React.useCallback(
    (...args: Parameters<T>) => {
      if (scheduledRef.current) {
        return;
      }
      scheduledRef.current = true;

      const runner = () => {
        scheduledRef.current = false;
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
    [callback, nextFrame],
  );

  return schedule;
}
