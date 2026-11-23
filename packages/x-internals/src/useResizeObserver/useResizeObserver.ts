'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { isReactVersionAtLeast } from '@base-ui/utils/reactVersion';

const isDevEnvironment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
// React 17 can commit layout changes synchronously during resize delivery.
const shouldDefer = isDevEnvironment || !isReactVersionAtLeast(18);

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
      // See https://github.com/mui/mui-x/issues/8733
      // Keep production measurements in the same frame on React 18 and later.
      if (shouldDefer) {
        frameID = requestAnimationFrame(() => {
          fnRef.current(entries);
        });
      } else {
        fnRef.current(entries);
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
  }, [ref, enabled]);
}
