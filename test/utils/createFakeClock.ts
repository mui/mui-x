import { act } from '@mui/internal-test-utils';
import { vi } from 'vitest';

export interface Clock {
  /**
   * Runs all timers until there are no more remaining.
   * WARNING: This may cause an infinite loop if a timeout constantly schedules another timeout.
   * Prefer to to run only pending timers with `runToLast` and unmount your component directly.
   */
  runAll(): Promise<void>;
  /**
   * Runs only the currently pending timers.
   */
  runToLast(): Promise<void>;
  /**
   * Tick the clock ahead `timeoutMS` milliseconds.
   * @param timeoutMS
   */
  tick(timeoutMS: number): Promise<void>;
  /**
   * Returns true if we're running with "real" i.e. native timers.
   */
  isReal(): boolean;
  /**
   * Runs the current test suite (i.e. `describe` block) with fake timers.
   */
  withFakeTimers(): void;
  /**
   * Restore the real timer
   */
  restore(): void;
}

export type ClockConfig = undefined | number | Date;

export function createClock(
  config?: ClockConfig,
  options?: Exclude<Parameters<typeof vi.useFakeTimers>[0], number | Date>,
): Clock {
  beforeEach(() => {
    if (config) {
      vi.setSystemTime(config);
    }
  });
  afterEach(() => {
    if (config) {
      vi.useRealTimers();
    }
  });

  return {
    withFakeTimers() {
      beforeEach(() => {
        vi.useFakeTimers(options);
      });
      afterEach(() => {
        vi.useRealTimers();
      });
    },
    async runToLast() {
      await act(async () => vi.runOnlyPendingTimersAsync());
    },
    isReal() {
      return !vi.isFakeTimers();
    },
    restore() {
      vi.useRealTimers();
    },
    async tick(timeoutMS: number) {
      await act(async () => vi.advanceTimersByTimeAsync(timeoutMS));
    },
    async runAll() {
      await act(async () => vi.runAllTimersAsync());
    },
  };
}
