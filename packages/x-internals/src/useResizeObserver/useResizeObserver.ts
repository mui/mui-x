'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { isReactVersionAtLeast } from '@base-ui/utils/reactVersion';

const isDevEnvironment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
// React 17 commits state updates synchronously inside the observer callback.
const deferByDefault = isDevEnvironment || !isReactVersionAtLeast(18);

const noop = () => {};

export function useResizeObserver(
  ref: React.RefObject<HTMLElement | undefined | null>,
  fn: (entries: ResizeObserverEntry[]) => void,
  enabled?: boolean,
  { defer = false }: { defer?: boolean } = {},
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
      // A callback that changes observed layout must run outside resize delivery.
      // See https://github.com/mui/mui-x/issues/8733
      if (deferByDefault || defer) {
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
  }, [ref, enabled, defer]);
}
