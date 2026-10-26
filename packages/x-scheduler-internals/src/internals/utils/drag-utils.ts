import type {
  SchedulerOccurrencePlaceholder,
  SchedulerOccurrencePlaceholderInternalDragOrResize,
  TemporalSupportedObject,
} from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import type { PlainDate } from './base-temporal/PlainDate';
import { addToAdapterDate, createAdapterDate } from './plain-date-utils/adapter';
import { toEpochMs, toPlainDateTime } from './plain-date-utils/timeZone';

const INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES = new Set(['internal-drag', 'internal-resize']);

export function isInternalDragOrResizePlaceholder(
  placeholder: SchedulerOccurrencePlaceholder | null,
): placeholder is SchedulerOccurrencePlaceholderInternalDragOrResize {
  return placeholder !== null && INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES.has(placeholder.type);
}

/**
 * Moves a date to `plainDate`, keeping its time of day on the wall clock of its timezone. The times
 * a DST transition skips or repeats resolve like `toEpochMs()`.
 */
export function moveToPlainDate(
  adapter: Adapter,
  date: TemporalSupportedObject,
  plainDate: PlainDate,
): TemporalSupportedObject {
  const timezone = adapter.getTimezone(date);
  const { msInDay } = toPlainDateTime(adapter.getTime(date), timezone);
  return createAdapterDate(adapter, toEpochMs(plainDate, msInDay, timezone), timezone);
}

/**
 * Moves a date by whole days like `addToAdapterDate()`, and returns it unchanged for 0 days.
 */
export function addDaysOnWallClock(
  adapter: Adapter,
  date: TemporalSupportedObject,
  dayCount: number,
): TemporalSupportedObject {
  return dayCount === 0 ? date : addToAdapterDate(adapter, date, { days: dayCount });
}
