// `test/regressions` renders in a plain Vite app driven by Playwright, not in a Vitest
// context, so `vi.useFakeTimers` is not available here. Use the fake-timers package
// Vitest itself is built on.
import { install, type Clock, type FakeMethod } from '@sinonjs/fake-timers';

// Use a "real timestamp" so that we see a useful date instead of "00:00"
const DEFAULT_TIMESTAMP = '2014-08-18T14:11:54-05:00';
const NOW = new Date(DEFAULT_TIMESTAMP).getTime();

const DATE_METHODS = ['Date', 'Intl'] as const satisfies readonly FakeMethod[];
const TIMER_METHODS = [
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'requestIdleCallback',
  'cancelIdleCallback',
] as const satisfies readonly FakeMethod[];

// The date-only clock stays installed between test cases, so a timer method in both lists
// would stay faked. This fails to type-check if the lists overlap.
type OverlappingMethods = Extract<(typeof DATE_METHODS)[number], (typeof TIMER_METHODS)[number]>;
true satisfies [OverlappingMethods] extends [never] ? true : never;

// The date is always frozen, so demos that show "today" are stable.
// Timers are only faked while a test case mounts, see `fakeTimers` and `flushTimers`.
let clock: Clock = freezeDate();
// Whether `clock` fakes the timers and still has to be flushed.
let timersFaked = false;

// Only call it when no clock is installed: fake-timers throws if `Date` is already faked.
function freezeDate() {
  return install({ now: NOW, toFake: [...DATE_METHODS] });
}

/**
 * Fakes the timers until `flushTimers` is called. Call it before a test case mounts.
 * Calling it again before `flushTimers` drops the pending fake timers, for example when
 * navigating away before the previous test case settled.
 */
export function fakeTimers() {
  clock.uninstall();
  clock = install({
    now: NOW,
    toFake: [...DATE_METHODS, ...TIMER_METHODS],
    // Allows clearing timers that were scheduled before the clock was installed,
    // for example by the previous test case when it unmounts.
    shouldClearNativeTimers: true,
  });
  timersFaked = true;
}

// How long to keep running the timers that the flushed timers schedule in turn,
// for example a fake fetch followed by `autosizeColumns`.
const SETTLE_MS = 2000;

/**
 * Runs all the timers scheduled while the test case mounted, so it reaches its final state
 * (for example, a fake server that responds after a delay). Then goes back to real timers.
 * Without a preceding `fakeTimers`, for example when the page is opened on a test case directly,
 * there is nothing to flush.
 */
export async function flushTimers() {
  if (timersFaked) {
    // Claim the flush, so that a second call doesn't tick the same clock concurrently.
    timersFaked = false;
    const current = clock;
    await current.runToLastAsync();
    // Timers scheduled after the last one would otherwise be dropped by `uninstall`.
    await current.tickAsync(SETTLE_MS);
    if (clock !== current) {
      // `fakeTimers` was called again in the meantime.
      return;
    }
    clock.uninstall();
    clock = freezeDate();
  }
  // Let the layout updates that run in an animation frame land, for example a chart resize.
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}
