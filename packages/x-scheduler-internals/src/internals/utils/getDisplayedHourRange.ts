import { warnOnce } from '@mui/x-internals/warning';

const DEFAULT_START_TIME = 0;
const DEFAULT_END_TIME = 24;

/**
 * Resolves and validates the `startTime` / `endTime` hour range of a time-grid based view.
 *
 * Both values must be whole hours between 0 and 24 with `startTime < endTime`. When the range is
 * invalid (non-integer, out of bounds, or inverted), it falls back to the full day (`0`–`24`) and
 * warns in development.
 */
export function getDisplayedHourRange(startTime?: number, endTime?: number) {
  const resolvedStartTime = startTime ?? DEFAULT_START_TIME;
  const resolvedEndTime = endTime ?? DEFAULT_END_TIME;

  const isValid =
    Number.isInteger(resolvedStartTime) &&
    Number.isInteger(resolvedEndTime) &&
    resolvedStartTime >= 0 &&
    resolvedEndTime <= 24 &&
    resolvedStartTime < resolvedEndTime;

  if (!isValid) {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce([
        `MUI X Scheduler: Received an invalid hour range (startTime: ${resolvedStartTime}, endTime: ${resolvedEndTime}).`,
        '`startTime` and `endTime` must be whole hours between 0 and 24 with `startTime` lower than `endTime`.',
        'Falling back to the full day (0–24).',
      ]);
    }
    return { startTime: DEFAULT_START_TIME, endTime: DEFAULT_END_TIME };
  }

  return { startTime: resolvedStartTime, endTime: resolvedEndTime };
}
