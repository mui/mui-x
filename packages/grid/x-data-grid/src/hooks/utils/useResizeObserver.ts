import * as React from 'react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';

const isDevEnvironment = process.env.NODE_ENV === 'development';

const noop = () => {};

export function useResizeObserver(
  ref: React.MutableRefObject<HTMLElement | undefined | null>,
  fn: (entries: ResizeObserverEntry[]) => void,
  enabled?: boolean,
) {
  useEnhancedEffect(() => {
    if (enabled === false || typeof ResizeObserver === 'undefined') {
      return noop;
    }

    let frameID = 0;

    const target = ref.current;
    const observer = new ResizeObserver((entries) => {
      // See https://github.com/mui/mui-x/issues/8733
      // In dev, we avoid the React warning by moving the task to the next frame.
      // In prod, we want the task to run in the same frame as to avoid tear.
      if (isDevEnvironment) {
        frameID = requestAnimationFrame(() => {
          fn(entries);
        });
      } else {
        fn(entries);
      }
    });

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (frameID) {
        cancelAnimationFrame(frameID);
      }

      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
