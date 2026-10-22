import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  SchedulerOccurrencePlaceholder,
  SchedulerOccurrencePlaceholderInternalDragOrResize,
  SchedulerProcessedDate,
  TemporalSupportedObject,
} from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { MS_PER_DAY } from './base-temporal/iso';
import { createAdapterDate } from './plain-date-utils/adapter';
import { localToEpochMs, toLocalMs } from './plain-date-utils/timeZone';

const INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES = new Set(['internal-drag', 'internal-resize']);

export function isInternalDragOrResizePlaceholder(
  placeholder: SchedulerOccurrencePlaceholder | null,
): placeholder is SchedulerOccurrencePlaceholderInternalDragOrResize {
  return placeholder !== null && INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES.has(placeholder.type);
}

// Day helpers for the drag and drop of the day grid, on the wall clock of the timezone of each
// date. The wall-clock times a DST transition skips or repeats resolve like `localToEpochMs()`.

/**
 * The day number of the date of an instant in `timezone`.
 */
export function toLocalDayNumber(epochMs: number, timezone: TemporalTimezone): number {
  return Math.floor(toLocalMs(epochMs, timezone) / MS_PER_DAY);
}

/**
 * The day number of a date, in its timezone.
 */
export function getAdapterDayNumber(adapter: Adapter, date: TemporalSupportedObject): number {
  return toLocalDayNumber(adapter.getTime(date), adapter.getTimezone(date));
}

/**
 * The day number of a processed date, in its timezone.
 */
export function getProcessedDayNumber(adapter: Adapter, date: SchedulerProcessedDate): number {
  return toLocalDayNumber(date.timestamp, adapter.getTimezone(date.value));
}

/**
 * Moves a date by whole days, keeping its time of day on the wall clock of its timezone.
 */
export function addDaysOnWallClock(
  adapter: Adapter,
  date: TemporalSupportedObject,
  dayCount: number,
): TemporalSupportedObject {
  if (dayCount === 0) {
    return date;
  }
  const timezone = adapter.getTimezone(date);
  const localMs = toLocalMs(adapter.getTime(date), timezone) + dayCount * MS_PER_DAY;
  return createAdapterDate(adapter, localToEpochMs(localMs, timezone), timezone);
}

/**
 * Moves a date to the day `dayNumber` of its timezone, keeping its time of day on the wall clock.
 */
export function moveToDay(
  adapter: Adapter,
  date: TemporalSupportedObject,
  dayNumber: number,
): TemporalSupportedObject {
  return addDaysOnWallClock(adapter, date, dayNumber - getAdapterDayNumber(adapter, date));
}
