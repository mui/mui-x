import { warnOnce } from '@mui/x-internals/warning';

const DEFAULT_START_TIME = 0;
const DEFAULT_END_TIME = 24;

/**
 * A resolved daily hour window: `startTime` inclusive, `endTime` exclusive, both whole
 * hours between 0 and 24.
 */
export interface DisplayedHourRange {
  startTime: number;
  endTime: number;
}

/**
 * Resolves and validates a `startTime` / `endTime` hour range, shared by the time-grid
 * views (`viewConfig`) and the timeline's hour-resolution presets (`presetConfig`).
 *
 * `startTime` is inclusive and `endTime` exclusive; both must be whole hours between 0
 * and 24 with `startTime < endTime`. When the range is invalid (non-integer, out of
 * bounds, or inverted), it falls back to the full day (`0`–`24`) and warns in
 * development. `source` names the prop the range came from (e.g. `viewConfig.week`,
 * `presetConfig.dayAndHour`) so the warning points at the misconfiguration.
 */
export function getDisplayedHourRange(
  startTime: number | undefined,
  endTime: number | undefined,
  source: string,
): DisplayedHourRange {
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
        `MUI X Scheduler: \`${source}\` received an invalid hour range (startTime: ${resolvedStartTime}, endTime: ${resolvedEndTime}).`,
        '`startTime` and `endTime` must be whole hours between 0 and 24 with `startTime` lower than `endTime`.',
        'Falling back to the full day (0–24).',
      ]);
    }
    return { startTime: DEFAULT_START_TIME, endTime: DEFAULT_END_TIME };
  }

  return { startTime: resolvedStartTime, endTime: resolvedEndTime };
}
