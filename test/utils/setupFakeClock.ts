import { useFakeTimers } from 'sinon';

declare global {
  interface Window {
    fakeClock: any;
  }
}

// Use a "real timestamp" so that we see a useful date instead of "00:00"
const DEFAULT_TIMESTAMP = 'Mon Aug 18 14:11:54 2014 -0500';

export function setupFakeClock(shouldAdvanceTime = true) {
  if (window.fakeClock) {
    window.fakeClock.restore();
    window.fakeClock = null;
  }

  window.fakeClock = useFakeTimers({
    now: new Date(DEFAULT_TIMESTAMP).getTime(),
    // We need to let time advance to use `useDemoData`, but on the pickers
    // test it makes the tests flaky
    shouldAdvanceTime,
  });

  return () => {
    window.fakeClock.restore();
  };
}
