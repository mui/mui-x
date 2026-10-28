import type {
  TemporalAdapter,
  TemporalSupportedObject,
  TemporalTimezone,
} from '@base-ui/react/internals/temporal';
import { MS_PER_DAY } from './base-temporal/iso';
import {
  localToEpochMs,
  toLocalDayNumber,
  toLocalMs,
  toMsInDay,
} from './plain-date-utils/timeZone';

const MINUTE_MS = 60_000;
export const FULL_DAY_MINUTES = 24 * 60;

/**
 * The hour window shown for each day of an axis.
 */
export interface TimelineAxisWindow {
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

/**
 * A displayed date range with the hour window shown for each day. When the window is
 * trimmed, the axis is piecewise — the hidden hours of each day take no space — so
 * px↔date conversions must go through these helpers. Built by the time-grid columns and the
 * day-grid rows from their timestamps, and from the timeline's preset config (horizontal axis)
 * with `getTimelineAxis()`.
 */
export interface TimelineAxis extends TimelineAxisWindow {
  /**
   * The timestamp of the first instant of the axis.
   */
  start: number;
  /**
   * The timestamp of the last instant of the axis.
   */
  end: number;
  /**
   * The timezone the days and the wall-clock times of the axis are read in.
   */
  timezone: TemporalTimezone;
}

/**
 * The range of an axis as adapter values, as the presets of the timeline return it, read by
 * `getTimelineAxis()`.
 */
export interface TimelineAxisRange extends TimelineAxisWindow {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
}

/**
 * Reads the bounds of a range once, in the timezone of its start. Both bounds, and the dates
 * placed on the axis, are read in that timezone.
 */
export function getTimelineAxis(adapter: TemporalAdapter, range: TimelineAxisRange): TimelineAxis {
  return {
    start: adapter.getTime(range.start),
    end: adapter.getTime(range.end),
    timezone: adapter.getTimezone(range.start),
    dayStartMinute: range.dayStartMinute,
    dayEndMinute: range.dayEndMinute,
  };
}

export function isFullDayAxisWindow(axis: TimelineAxisWindow) {
  return axis.dayStartMinute === 0 && axis.dayEndMinute === FULL_DAY_MINUTES;
}

/**
 * Whether a start bound's wall-clock minute falls outside the displayed window.
 * The day seam is ambiguous (day d at `dayEndMinute` and day d+1 at `dayStartMinute`
 * render at the same offset): a start on the exclusive end minute belongs to the
 * hidden hours, its rendered position is the next day's window start.
 */
export function isStartMinuteOutsideAxisWindow(
  axis: TimelineAxisWindow,
  minutesInDay: number,
): boolean {
  return minutesInDay < axis.dayStartMinute || minutesInDay >= axis.dayEndMinute;
}

/**
 * Whether an end bound's wall-clock minute falls outside the displayed window.
 * An end at midnight is minute 0 of the next day but closes the previous one, so it
 * is measured as minute 1440 against that day's window.
 */
export function isEndMinuteOutsideAxisWindow(
  axis: TimelineAxisWindow,
  minutesInDay: number,
): boolean {
  const minute = minutesInDay === 0 ? FULL_DAY_MINUTES : minutesInDay;
  return minute <= axis.dayStartMinute || minute > axis.dayEndMinute;
}

/**
 * Visible duration of one day in axis milliseconds. Days are measured in wall-clock
 * minutes (a full day is always 1440 minutes) so the axis matches the rendered grid,
 * whose tick count is pinned per day and does not stretch on DST transitions.
 */
export function getTimelineAxisDayMs(axis: TimelineAxisWindow): number {
  return Math.max(1, axis.dayEndMinute - axis.dayStartMinute) * MINUTE_MS;
}

/**
 * Returns the total duration of the axis in axis milliseconds: each day contributes
 * exactly its visible wall-clock minutes.
 */
export function getTimelineAxisDurationMs(axis: TimelineAxis): number {
  const totalDays =
    toLocalDayNumber(axis.end, axis.timezone) - toLocalDayNumber(axis.start, axis.timezone) + 1;
  return totalDays * getTimelineAxisDayMs(axis);
}

/**
 * Maps an axis offset (in axis milliseconds from the collection start) to a timestamp.
 * Offsets are not clamped: values outside the axis extend it day by day, following the
 * same piecewise scale.
 * The timestamp is built from its wall-clock time so it round-trips with
 * `timestampToTimelineAxisOffsetMs()` for every wall-clock time that exists on that day.
 * The axis keeps a slot for the hour skipped by a spring-forward transition, so offsets
 * landing in it move forward by the length of the gap and do not round-trip. An offset
 * landing in the hour repeated by a fall-back transition resolves to its first instant,
 * whatever the timezone of the system (RFC 5545).
 */
export function timelineAxisOffsetToTimestamp(axis: TimelineAxis, offsetMs: number): number {
  // A column without a size gives a non-finite offset, which maps to `NaN`.
  if (!Number.isFinite(offsetMs)) {
    return NaN;
  }
  const dayMs = getTimelineAxisDayMs(axis);
  const dayIndex = Math.floor(offsetMs / dayMs);
  const msInDay = axis.dayStartMinute * MINUTE_MS + (offsetMs - dayIndex * dayMs);
  // Day numbers, as this runs on every pointer move.
  const dayNumber = toLocalDayNumber(axis.start, axis.timezone) + dayIndex;
  return localToEpochMs(dayNumber * MS_PER_DAY + msInDay, axis.timezone);
}

/**
 * Moves an instant read on the axis before `fromMs`, the start of the element it belongs to, to
 * the same wall-clock time in the offset of `fromMs`, when that's a later instant showing it.
 * The axis resolves a wall-clock time that a fall-back transition repeats to its first instant,
 * while an element starting in the second occurrence renders over both, so this reads the times
 * over that element in the second occurrence. Other instants are returned unchanged.
 */
export function resolveRepeatedTimeFrom(
  epochMs: number,
  fromMs: number,
  timezone: TemporalTimezone,
): number {
  if (epochMs >= fromMs) {
    return epochMs;
  }
  const localMs = toLocalMs(epochMs, timezone);
  // The same wall-clock time, in the offset of `fromMs`.
  const shiftedMs = fromMs + localMs - toLocalMs(fromMs, timezone);
  return shiftedMs > epochMs && toLocalMs(shiftedMs, timezone) === localMs ? shiftedMs : epochMs;
}

/**
 * Maps a timestamp to its axis offset (in axis milliseconds from the collection start), reading it
 * in the timezone of the axis.
 * Timestamps outside the visible window are clamped to their day's window edge; timestamps outside
 * the collection range produce out-of-range offsets (e.g. negative before the start).
 * `msInDay`, the wall-clock time of day in the timezone of the axis, can be provided when the
 * caller already knows it (e.g. from a `SchedulerProcessedDate`), skipping its computation.
 */
export function timestampToTimelineAxisOffsetMs(
  axis: TimelineAxis,
  timestamp: number,
  msInDay: number = toMsInDay(timestamp, axis.timezone),
): number {
  // Day numbers, as this runs for every event.
  const dayIndex =
    toLocalDayNumber(timestamp, axis.timezone) - toLocalDayNumber(axis.start, axis.timezone);
  return getTimelineAxisOffsetMs(axis, dayIndex, msInDay);
}

/**
 * The axis offset of a wall-clock time on the `dayIndex`-th day of the axis, clamped to the
 * displayed window of that day.
 */
export function getTimelineAxisOffsetMs(
  axis: TimelineAxisWindow,
  dayIndex: number,
  msInDay: number,
): number {
  const clampedMsInDay = Math.min(
    Math.max(msInDay, axis.dayStartMinute * MINUTE_MS),
    axis.dayEndMinute * MINUTE_MS,
  );
  return dayIndex * getTimelineAxisDayMs(axis) + (clampedMsInDay - axis.dayStartMinute * MINUTE_MS);
}
