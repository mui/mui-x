'use client';
/**
 * TODO, remove this file, have dependents import from:
 * import useTimeout from '@mui/utils/useTimeout';
 * directly.
 */
import useLazyRef from '@mui/utils/useLazyRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

class Timeout {
  static create() {
    return new Timeout();
  }

  currentId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */
  start(delay: number, fn: Function) {
    this.clear();
    this.currentId = setTimeout(() => {
      this.currentId = null;
      fn();
    }, delay);
  }

  clear = () => {
    if (this.currentId !== null) {
      clearTimeout(this.currentId);
      this.currentId = null;
    }
  };

  disposeEffect = () => {
    return this.clear;
  };
}

export function useTimeout() {
  const timeout = useLazyRef(Timeout.create).current;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEnhancedEffect(timeout.disposeEffect, []);

  return timeout;
}
