import type { TemporalAdapter, TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import { buildTemporalPlainDate, createAdapterDate } from './plain-date-utils/adapter';
import { addDaysToPlainDate } from './plain-date-utils/plainDate';
import { toEpochMs, toLocalDayNumber, toPlainDateTime } from './plain-date-utils/timeZone';

const MINUTE_MS = 60_000;
export const FULL_DAY_MINUTES = 24 * 60;

/**
 * A displayed date range with the hour window shown for each day. When the window is
 * trimmed, the axis is piecewise — the hidden hours of each day take no space — so
 * px↔date conversions must go through these helpers. Satisfied by the timeline's
 * preset config (horizontal axis) and the time-grid column context (vertical axis).
 */
export interface TimelineAxis {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  /**
   * First displayed minute of each day, as an offset from midnight.
   */
  dayStartMinute: number;
  /**
   * End of the displayed window for each day, as an exclusive offset from midnight
   * (1440 for the full day).
   */
  dayEndMinute: number;
}

export function isFullDayAxisWindow(axis: TimelineAxis) {
  return axis.dayStartMinute === 0 && axis.dayEndMinute === FULL_DAY_MINUTES;
}

/**
 * Whether a start bound's wall-clock minute falls outside the displayed window.
 * The day seam is ambiguous (day d at `dayEndMinute` and day d+1 at `dayStartMinute`
 * render at the same offset): a start on the exclusive end minute belongs to the
 * hidden hours, its rendered position is the next day's window start.
 */
export function isStartMinuteOutsideAxisWindow(axis: TimelineAxis, minutesInDay: number): boolean {
  return minutesInDay < axis.dayStartMinute || minutesInDay >= axis.dayEndMinute;
}

/**
 * Whether an end bound's wall-clock minute falls outside the displayed window.
 * An end at midnight is minute 0 of the next day but closes the previous one, so it
 * is measured as minute 1440 against that day's window.
 */
export function isEndMinuteOutsideAxisWindow(axis: TimelineAxis, minutesInDay: number): boolean {
  const minute = minutesInDay === 0 ? FULL_DAY_MINUTES : minutesInDay;
  return minute <= axis.dayStartMinute || minute > axis.dayEndMinute;
}

/**
 * Visible duration of one day in axis milliseconds. Days are measured in wall-clock
 * minutes (a full day is always 1440 minutes) so the axis matches the rendered grid,
 * whose tick count is pinned per day and does not stretch on DST transitions.
 */
export function getTimelineAxisDayMs(
  axis: Pick<TimelineAxis, 'dayStartMinute' | 'dayEndMinute'>,
): number {
  return Math.max(1, axis.dayEndMinute - axis.dayStartMinute) * MINUTE_MS;
}

/**
 * Wall-clock time of day in milliseconds. Read on the wall clock of the timezone of the date
 * rather than from timestamp differences so DST transitions earlier in the day cannot shift it.
 */
export function getWallClockMsInDay(adapter: TemporalAdapter, date: TemporalSupportedObject) {
  return toPlainDateTime(adapter.getTime(date), adapter.getTimezone(date)).msInDay;
}

function getTotalDays(adapter: TemporalAdapter, axis: TimelineAxis) {
  return (
    buildTemporalPlainDate(adapter, axis.end).dayNumber -
    buildTemporalPlainDate(adapter, axis.start).dayNumber +
    1
  );
}

/**
 * Returns the total duration of the axis in axis milliseconds: each day contributes
 * exactly its visible wall-clock minutes.
 */
export function getTimelineAxisDurationMs(adapter: TemporalAdapter, axis: TimelineAxis): number {
  return getTotalDays(adapter, axis) * getTimelineAxisDayMs(axis);
}

/**
 * Maps an axis offset (in axis milliseconds from the collection start) to a date.
 * Offsets are not clamped: values outside the axis extend it day by day, following the
 * same piecewise scale.
 * The date is built from its wall-clock time so it round-trips with
 * `dateToTimelineAxisOffsetMs` for every wall-clock time that exists on that day.
 * The axis keeps a slot for the hour skipped by a spring-forward transition, so offsets
 * landing in it move forward by the length of the gap and do not round-trip. An offset
 * landing in the hour repeated by a fall-back transition resolves to its first instant,
 * whatever the timezone of the system (RFC 5545).
 */
export function timelineAxisOffsetToDate(
  adapter: TemporalAdapter,
  axis: TimelineAxis,
  offsetMs: number,
): TemporalSupportedObject {
  const dayMs = getTimelineAxisDayMs(axis);
  const dayIndex = Math.floor(offsetMs / dayMs);
  const msInDay = axis.dayStartMinute * MINUTE_MS + (offsetMs - dayIndex * dayMs);

  const timezone = adapter.getTimezone(axis.start);
  const plainDate = addDaysToPlainDate(buildTemporalPlainDate(adapter, axis.start), dayIndex);
  return createAdapterDate(adapter, toEpochMs(plainDate, msInDay, timezone), timezone);
}

/**
 * Maps a date to its axis offset (in axis milliseconds from the collection start).
 * Dates outside the visible window are clamped to their day's window edge; dates outside
 * the collection range produce out-of-range offsets (e.g. negative before the start).
 * `msInDay` can be provided when the caller already knows the wall-clock time of day
 * (e.g. from a `SchedulerProcessedDate`), skipping the adapter reads.
 */
export function dateToTimelineAxisOffsetMs(
  adapter: TemporalAdapter,
  axis: TimelineAxis,
  date: TemporalSupportedObject,
  msInDay: number = getWallClockMsInDay(adapter, date),
): number {
  // Both days are read in the timezone of the date. Day numbers, as this runs for every event.
  const timezone = adapter.getTimezone(date);
  const dayIndex =
    toLocalDayNumber(adapter.getTime(date), timezone) -
    toLocalDayNumber(adapter.getTime(axis.start), timezone);
  return getTimelineAxisOffsetMs(axis, dayIndex, msInDay);
}

/**
 * The axis offset of a wall-clock time on the `dayIndex`-th day of the axis, clamped to the
 * displayed window of that day.
 */
export function getTimelineAxisOffsetMs(
  axis: Pick<TimelineAxis, 'dayStartMinute' | 'dayEndMinute'>,
  dayIndex: number,
  msInDay: number,
): number {
  const clampedMsInDay = Math.min(
    Math.max(msInDay, axis.dayStartMinute * MINUTE_MS),
    axis.dayEndMinute * MINUTE_MS,
  );
  return dayIndex * getTimelineAxisDayMs(axis) + (clampedMsInDay - axis.dayStartMinute * MINUTE_MS);
}
