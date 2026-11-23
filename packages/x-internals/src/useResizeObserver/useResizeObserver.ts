'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

const noop = () => {};

export function useResizeObserver(
  ref: React.RefObject<HTMLElement | undefined | null>,
  fn: (entries: ResizeObserverEntry[]) => void,
  enabled?: boolean,
) {
  const fnRef = React.useRef(null as unknown as typeof fn);
  fnRef.current = fn;

  useEnhancedEffect(() => {
    if (enabled === false || typeof ResizeObserver === 'undefined') {
      return noop;
    }

    let frameID = 0;

    const target = ref.current;
    const observer = new ResizeObserver((entries) => {
      // Next frame: a layout change inside the delivery reports a "ResizeObserver loop" error,
      // e.g. React 17 renders a `setState` here synchronously. See https://github.com/mui/mui-x/issues/8733
      frameID = requestAnimationFrame(() => {
        fnRef.current(entries);
      });
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
  }, [ref, enabled]);
}
