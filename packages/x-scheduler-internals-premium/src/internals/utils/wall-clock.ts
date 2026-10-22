import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import { localToEpochMs, toLocalMs } from '@mui/x-scheduler-internals/internals';

// Day helpers on the wall clock of a timezone, for the dependency engine. A wall-clock time
// skipped by a DST transition moves forward by the length of the gap, and a repeated one
// resolves to its first instant, whatever the timezone of the system (RFC 5545).

const MS_PER_DAY = 86_400_000;
// The range of `Date`, minus a margin for the offsets read around a wall-clock time.
const MAX_LOCAL_MS = 8.64e15 - 2 * MS_PER_DAY;

/**
 * The day number of the date of an instant in `timezone`.
 */
export function toLocalDayNumber(epochMs: number, timezone: TemporalTimezone): number {
  return Math.floor(toLocalMs(epochMs, timezone) / MS_PER_DAY);
}

/**
 * The first instant of a day in `timezone`. A day whose midnight a DST transition skips starts at
 * the end of the gap.
 */
export function getDayStartMs(dayNumber: number, timezone: TemporalTimezone): number {
  return localToEpochMs(dayNumber * MS_PER_DAY, timezone);
}

/**
 * The last instant of a day in `timezone`, just before the next day starts.
 * When a DST transition repeats the last hour of the day, it's the later 23:59:59.999.
 */
export function getDayEndMs(dayNumber: number, timezone: TemporalTimezone): number {
  return getDayStartMs(dayNumber + 1, timezone) - 1;
}

/**
 * Adds days to an instant on the wall clock of `timezone`, keeping its time of day.
 * Returns `NaN` past the range of `Date`.
 */
export function addDaysOnWallClock(
  epochMs: number,
  days: number,
  timezone: TemporalTimezone,
): number {
  const localMs = toLocalMs(epochMs, timezone) + days * MS_PER_DAY;
  return Math.abs(localMs) > MAX_LOCAL_MS ? NaN : localToEpochMs(localMs, timezone);
}
