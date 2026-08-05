import type { TemporalAdapter, TemporalSupportedObject } from '../../base-ui-copy';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
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
export function getTimelineAxisDayMs(axis: TimelineAxis): number {
  return Math.max(1, axis.dayEndMinute - axis.dayStartMinute) * MINUTE_MS;
}

/**
 * Wall-clock time of day in milliseconds. Built from calendar components rather than
 * timestamp differences so DST transitions earlier in the day cannot shift it.
 */
export function getWallClockMsInDay(adapter: TemporalAdapter, date: TemporalSupportedObject) {
  return (
    adapter.getHours(date) * HOUR_MS +
    adapter.getMinutes(date) * MINUTE_MS +
    adapter.getSeconds(date) * 1000 +
    adapter.getMilliseconds(date)
  );
}

function getTotalDays(adapter: TemporalAdapter, axis: TimelineAxis) {
  return adapter.differenceInDays(adapter.startOfDay(axis.end), adapter.startOfDay(axis.start)) + 1;
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
 * The date is built from wall-clock components so it round-trips with
 * `dateToTimelineAxisOffsetMs` for every wall-clock time that exists on that day.
 * Offsets landing in the hour skipped by a spring-forward transition resolve to the
 * next existing hour and do not round-trip (known limitation).
 */
export function timelineAxisOffsetToDate(
  adapter: TemporalAdapter,
  axis: TimelineAxis,
  offsetMs: number,
): TemporalSupportedObject {
  const dayMs = getTimelineAxisDayMs(axis);
  const dayIndex = Math.floor(offsetMs / dayMs);
  const msInDay = axis.dayStartMinute * MINUTE_MS + (offsetMs - dayIndex * dayMs);

  const dayStart = adapter.startOfDay(adapter.addDays(axis.start, dayIndex));
  const minutesInDay = Math.floor(msInDay / MINUTE_MS);
  const subMinuteMs = msInDay - minutesInDay * MINUTE_MS;

  let date = adapter.setHours(dayStart, Math.floor(minutesInDay / 60));
  date = adapter.setMinutes(date, minutesInDay % 60);
  if (subMinuteMs > 0) {
    date = adapter.setSeconds(date, Math.floor(subMinuteMs / 1000));
    date = adapter.setMilliseconds(date, subMinuteMs % 1000);
  }
  return date;
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
  const dayMs = getTimelineAxisDayMs(axis);
  const dayIndex = adapter.differenceInDays(
    adapter.startOfDay(date),
    adapter.startOfDay(axis.start),
  );
  const clampedMsInDay = Math.min(
    Math.max(msInDay, axis.dayStartMinute * MINUTE_MS),
    axis.dayEndMinute * MINUTE_MS,
  );

  return dayIndex * dayMs + (clampedMsInDay - axis.dayStartMinute * MINUTE_MS);
}

/**
 * Whether a date range occupies any space on the axis: with a full-day window every
 * non-empty range does; with a trimmed window a range fully contained in the hidden
 * hours collapses to a zero-width sliver and should not be rendered.
 */
export function isRangeVisibleOnTimelineAxis(
  adapter: TemporalAdapter,
  axis: TimelineAxis,
  rangeStart: TemporalSupportedObject,
  rangeEnd: TemporalSupportedObject,
): boolean {
  if (isFullDayAxisWindow(axis)) {
    return true;
  }

  return (
    dateToTimelineAxisOffsetMs(adapter, axis, rangeEnd) >
    dateToTimelineAxisOffsetMs(adapter, axis, rangeStart)
  );
}
