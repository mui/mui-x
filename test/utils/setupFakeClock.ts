import { vi } from 'vitest';

declare global {
  interface Window {
    fakeClock: any;
  }
}

// Use a "real timestamp" so that we see a useful date instead of "00:00"
const DEFAULT_TIMESTAMP = '2014-08-18T14:11:54-05:00';

// eslint-disable-next-line import/no-mutable-exports
export let fakeClock: { restore: () => void } | undefined;

setupFakeClock();

export function setupFakeClock(shouldAdvanceTime = true) {
  restoreFakeClock();

  vi.useFakeTimers();
  vi.setSystemTime(new Date(DEFAULT_TIMESTAMP).getTime());

  fakeClock = {
    restore: () => vi.useRealTimers(),
  };

  return restoreFakeClock;
}

export function restoreFakeClock() {
  if (fakeClock) {
    vi.runAllTimers();
    fakeClock.restore();
    fakeClock = undefined;
  }
}
