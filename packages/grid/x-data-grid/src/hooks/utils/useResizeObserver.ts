import * as React from 'react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';

export function useResizeObserver(ref: React.MutableRefObject<HTMLElement | null>, fn: Function) {
  useEnhancedEffect(() => {
    fn();

    if (typeof ResizeObserver === 'undefined') {
      return () => {};
    }

    let frameID = 0;

    const target = ref.current;
    const observer = new ResizeObserver(() => {
      // See https://github.com/mui/mui-x/issues/8733
      frameID = requestAnimationFrame(() => {
        fn();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
