import { warnOnce } from '@mui/x-internals/warning';
import type { DisplayedHourRange } from './getDisplayedHourRange';

const DEFAULT_INITIAL_SCROLL_TIME = 7;

/**
 * Resolves the hour a time grid scrolls to on mount, against its displayed hour range.
 * Same rules as `getDisplayedHourRange`: a whole hour inside the range, or the default
 * (7 AM, clamped into the range) with a warning in development when the value is invalid.
 */
export function getInitialScrollTime(
  initialScrollTime: number | undefined,
  range: DisplayedHourRange,
  source: string,
): number {
  const { startTime, endTime } = range;

  if (initialScrollTime !== undefined) {
    const isValid =
      Number.isInteger(initialScrollTime) &&
      initialScrollTime >= startTime &&
      initialScrollTime < endTime;

    if (isValid) {
      return initialScrollTime;
    }

    if (process.env.NODE_ENV !== 'production') {
      warnOnce([
        `MUI X Scheduler: \`${source}\` received an invalid \`initialScrollTime\` (${initialScrollTime}).`,
        `\`initialScrollTime\` must be a whole hour within the displayed range (${startTime} to ${endTime - 1}).`,
        'Falling back to the default (7 AM, or the closest displayed hour).',
      ]);
    }
  }

  // A range ending at or before the default has nothing to scroll to: stay at the top.
  if (DEFAULT_INITIAL_SCROLL_TIME >= endTime) {
    return startTime;
  }
  return Math.max(DEFAULT_INITIAL_SCROLL_TIME, startTime);
}
