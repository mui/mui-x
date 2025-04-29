import { CleanupTracking, UnregisterToken, UnsubscribeFn } from './CleanupTracking';

// If no effect ran after this amount of time, we assume that the render was not committed by React
const CLEANUP_TIMER_LOOP_MILLIS = 1000;

export class TimerBasedCleanupTracking implements CleanupTracking {
  timeouts? = new Map<number, ReturnType<typeof setTimeout>>();

  cleanupTimeout = CLEANUP_TIMER_LOOP_MILLIS;

  constructor(timeout = CLEANUP_TIMER_LOOP_MILLIS) {
    this.cleanupTimeout = timeout;
  }

  register(object: any, unsubscribe: UnsubscribeFn, unregisterToken: UnregisterToken): void {
    if (!this.timeouts) {
      this.timeouts = new Map<number, ReturnType<typeof setTimeout>>();
    }

    const timeout = setTimeout(() => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      this.timeouts!.delete(unregisterToken.cleanupToken);
    }, this.cleanupTimeout);

    this.timeouts!.set(unregisterToken!.cleanupToken, timeout);
  }

  unregister(unregisterToken: UnregisterToken): void {
    const timeout = this.timeouts!.get(unregisterToken.cleanupToken);
    if (timeout) {
      this.timeouts!.delete(unregisterToken.cleanupToken);
      clearTimeout(timeout);
    }
  }

  reset() {
    if (this.timeouts) {
      this.timeouts.forEach((value, key) => {
        this.unregister({ cleanupToken: key });
      });
      this.timeouts = undefined;
    }
  }
}
