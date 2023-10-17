import * as React from 'react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';

export function useResizeObserver(ref: React.MutableRefObject<HTMLElement | null>, fn: Function) {
  useEnhancedEffect(() => {
    fn();

    if (typeof ResizeObserver === 'undefined') {
      return () => {};
    }

    const target = ref.current;

    let animationFrame: number;
    const observer = new ResizeObserver(() => {
      // See https://github.com/mui/mui-x/issues/8733
      animationFrame = requestAnimationFrame(() => {
        fn();
      });
    });

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);
}
