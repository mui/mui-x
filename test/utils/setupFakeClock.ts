// `test/regressions` renders in a plain Vite app driven by Playwright, not in a Vitest
// context, so `vi.useFakeTimers` is not available here. Use the fake-timers package
// Vitest itself is built on, which is what Sinon wrapped.
import { install, type Clock } from '@sinonjs/fake-timers';

declare global {
  interface Window {
    fakeClock: any;
  }
}

// Use a "real timestamp" so that we see a useful date instead of "00:00"
const DEFAULT_TIMESTAMP = '2014-08-18T14:11:54-05:00';

// eslint-disable-next-line import/no-mutable-exports
export let fakeClock: Clock | undefined;

setupFakeClock();

export function setupFakeClock(shouldAdvanceTime = true) {
  restoreFakeClock();

  fakeClock = install({
    now: new Date(DEFAULT_TIMESTAMP).getTime(),
    // We need to let time advance to use `useDemoData`, but on the pickers
    // test it makes the tests flaky
    shouldAdvanceTime,
    // Allows cancelAnimationFrame to clear native (pre-fake-clock) animation frames
    // without throwing a warning. Needed for streaming demos that schedule rAFs before
    // fake timers are installed.
    shouldClearNativeTimers: true,
  });

  return restoreFakeClock;
}

export function restoreFakeClock() {
  if (fakeClock) {
    fakeClock.runToLast();
    fakeClock.uninstall();
    fakeClock = undefined;
  }
}
