import * as React from 'react';

export function useRunOncePerLoop(callback: () => void, nextFrame: boolean = false) {
  const scheduledRef = React.useRef(false);

  const schedule = React.useCallback(() => {
    if (scheduledRef.current) {
      return;
    }
    scheduledRef.current = true;

    const runner = () => {
      scheduledRef.current = false;
      callback();
    };

    if (nextFrame) {
      requestAnimationFrame(runner);
      return;
    }

    if (typeof queueMicrotask === 'function') {
      queueMicrotask(runner);
    } else {
      Promise.resolve().then(runner);
    }
  }, [callback]);

  return schedule;
}
