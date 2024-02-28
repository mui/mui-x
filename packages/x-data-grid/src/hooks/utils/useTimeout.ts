'use client';
import { useLazyRef } from './useLazyRef';
import { useOnMount } from './useOnMount';

export class Timeout {
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

  useOnMount(timeout.disposeEffect);

  return timeout;
}
