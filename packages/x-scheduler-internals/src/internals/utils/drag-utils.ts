import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  SchedulerOccurrencePlaceholder,
  SchedulerOccurrencePlaceholderInternalDragOrResize,
  TemporalSupportedObject,
} from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import type { PlainDate } from './base-temporal/PlainDate';
import { createAdapterDate } from './plain-date-utils/adapter';
import { toEpochMs, toPlainDateTime } from './plain-date-utils/timeZone';

const INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES = new Set(['internal-drag', 'internal-resize']);

export function isInternalDragOrResizePlaceholder(
  placeholder: SchedulerOccurrencePlaceholder | null,
): placeholder is SchedulerOccurrencePlaceholderInternalDragOrResize {
  return placeholder !== null && INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES.has(placeholder.type);
}

/**
 * Moves a timestamp to `plainDate`, keeping its time of day on the wall clock of `timezone`. The
 * times a DST transition skips or repeats resolve like `toEpochMs()`.
 */
export function moveTimestampToPlainDate(
  timestamp: number,
  plainDate: PlainDate,
  timezone: TemporalTimezone,
): number {
  return toEpochMs(plainDate, toPlainDateTime(timestamp, timezone).msInDay, timezone);
}

/**
 * Moves a date to `plainDate` like `moveTimestampToPlainDate()`, in the timezone of the date.
 */
export function moveToPlainDate(
  adapter: Adapter,
  date: TemporalSupportedObject,
  plainDate: PlainDate,
): TemporalSupportedObject {
  const timezone = adapter.getTimezone(date);
  return createAdapterDate(
    adapter,
    moveTimestampToPlainDate(adapter.getTime(date), plainDate, timezone),
    timezone,
  );
}

/**
 * Moves a timestamp by whole days, keeping its time of day on the wall clock of `timezone`.
 * Returns it unchanged for 0 days.
 */
export function addDaysOnWallClock(
  timestamp: number,
  dayCount: number,
  timezone: TemporalTimezone,
): number {
  if (dayCount === 0) {
    return timestamp;
  }
  const plainDateTime = toPlainDateTime(timestamp, timezone);
  return toEpochMs(plainDateTime.date.add({ days: dayCount }), plainDateTime.msInDay, timezone);
}
