import { isJSDOM } from '../../utils/isJSDOM';
import * as React from 'react';

export function useRunOncePerLoop<T extends (...args: any[]) => void>(
  callback: T,
  nextFrame: boolean = false,
) {
  console.log('IS JSDOM', isJSDOM);
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

      if (isJSDOM) {
        // callstack is different in JSDOM, can't get the optimisation to work
        runner();
      } else if (typeof queueMicrotask === 'function') {
        queueMicrotask(runner);
      } else {
        Promise.resolve().then(runner);
      }
    },
    [callback, nextFrame],
  );

  return schedule;
}
