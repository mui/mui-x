'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

const noop = () => {};

/**
 * Runs an effect once, when `condition` is true.
 */
export const useRunOnce = (condition: boolean, effect: React.EffectCallback) => {
  const didRun = React.useRef(false);

  useEnhancedEffect(() => {
    if (didRun.current || !condition) {
      return noop;
    }
    didRun.current = true;
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didRun.current || condition]);
};
