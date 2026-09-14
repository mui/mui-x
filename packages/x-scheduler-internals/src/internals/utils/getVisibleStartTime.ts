import { warnOnce } from '@mui/x-internals/warning';
import type { DisplayedHourRange } from './getDisplayedHourRange';

const DEFAULT_VISIBLE_START_TIME = 7;

/**
 * Resolves the hour of the day a time grid scrolls to on mount, against its displayed
 * hour range.
 *
 * Explicit values must be finite and within `[startTime, endTime]`; otherwise the grid
 * stays at the top of the range and a warning is logged in development. When no value
 * is provided, the default (7 AM) is clamped into the range without warning. `source`
 * names the prop the value came from (e.g. `viewConfig.week`).
 */
export function getVisibleStartTime(
  visibleStartTime: number | undefined,
  range: DisplayedHourRange,
  source: string,
): number {
  const { startTime, endTime } = range;

  if (visibleStartTime === undefined) {
    // A range ending at or before the default has nothing to scroll to: stay at the top.
    if (DEFAULT_VISIBLE_START_TIME >= endTime) {
      return startTime;
    }
    return Math.max(DEFAULT_VISIBLE_START_TIME, startTime);
  }

  const isValid =
    Number.isFinite(visibleStartTime) &&
    visibleStartTime >= startTime &&
    visibleStartTime <= endTime;

  if (!isValid) {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce([
        `MUI X Scheduler: \`${source}\` received an invalid \`visibleStartTime\` (${visibleStartTime}).`,
        `\`visibleStartTime\` must be an hour of the day within the displayed range (${startTime}–${endTime}).`,
        'Falling back to the start of the range.',
      ]);
    }
    return startTime;
  }

  return visibleStartTime;
}
