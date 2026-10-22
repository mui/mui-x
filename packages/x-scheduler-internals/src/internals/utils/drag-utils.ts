import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  SchedulerOccurrencePlaceholder,
  SchedulerOccurrencePlaceholderInternalDragOrResize,
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
// date. A wall-clock time a DST transition skips moves forward by the length of the gap, and a
// repeated one resolves to its first instant, whatever the timezone of the system (RFC 5545).

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
 * The first instant of a day in `timezone`, as an adapter value.
 */
export function createStartOfDay(
  adapter: Adapter,
  dayNumber: number,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return createAdapterDate(adapter, localToEpochMs(dayNumber * MS_PER_DAY, timezone), timezone);
}

/**
 * The last instant of a day in `timezone`, as an adapter value.
 */
export function createEndOfDay(
  adapter: Adapter,
  dayNumber: number,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return createAdapterDate(
    adapter,
    localToEpochMs((dayNumber + 1) * MS_PER_DAY, timezone) - 1,
    timezone,
  );
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
