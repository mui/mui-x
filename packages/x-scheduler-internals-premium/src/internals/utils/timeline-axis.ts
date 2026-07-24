import type {
  TemporalAdapter,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/base-ui-copy';

const MINUTE_MS = 60_000;
const FULL_DAY_MINUTES = 24 * 60;

/**
 * Describes the timeline's horizontal axis: the visible date range and the hour window
 * displayed for each day. When the window is trimmed, the axis is piecewise — the hidden
 * hours of each day take no space — so px↔date conversions must go through these helpers.
 */
export interface TimelineAxis {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  /**
   * First displayed minute of each day, as an offset from midnight.
   */
  dayStartMinute: number;
  /**
   * Last displayed minute of each day, as an offset from midnight.
   */
  dayEndMinute: number;
}

function isFullDayWindow(axis: TimelineAxis) {
  return axis.dayStartMinute === 0 && axis.dayEndMinute === FULL_DAY_MINUTES;
}

function getTotalDays(adapter: TemporalAdapter, axis: TimelineAxis) {
  return adapter.differenceInDays(adapter.startOfDay(axis.end), adapter.startOfDay(axis.start)) + 1;
}

/**
 * Returns the total duration of the axis in axis milliseconds.
 * With the full-day window this is the real duration of the range (DST days keep their
 * real length); with a trimmed window each day contributes exactly its visible minutes.
 */
export function getTimelineAxisDurationMs(adapter: TemporalAdapter, axis: TimelineAxis): number {
  if (isFullDayWindow(axis)) {
    return adapter.getTime(axis.end) - adapter.getTime(axis.start);
  }

  const dayMinutes = axis.dayEndMinute - axis.dayStartMinute;
  return getTotalDays(adapter, axis) * dayMinutes * MINUTE_MS;
}

/**
 * Maps an axis offset (in axis milliseconds from the collection start) to a date.
 * Offsets are not clamped: values outside the axis extend it piecewise day by day.
 */
export function timelineAxisOffsetToDate(
  adapter: TemporalAdapter,
  axis: TimelineAxis,
  offsetMs: number,
): TemporalSupportedObject {
  if (isFullDayWindow(axis)) {
    return adapter.addMilliseconds(axis.start, offsetMs);
  }

  const dayMinutes = axis.dayEndMinute - axis.dayStartMinute;
  const dayIndex = Math.floor(offsetMs / (dayMinutes * MINUTE_MS));
  const withinDayMs = offsetMs - dayIndex * dayMinutes * MINUTE_MS;

  const dayStart = adapter.startOfDay(adapter.addDays(axis.start, dayIndex));
  return adapter.addMilliseconds(adapter.addMinutes(dayStart, axis.dayStartMinute), withinDayMs);
}

/**
 * Maps a date to its axis offset (in axis milliseconds from the collection start).
 * Dates outside the visible window are clamped to their day's window edge; dates outside
 * the collection range produce out-of-range offsets (e.g. negative before the start).
 */
export function dateToTimelineAxisOffsetMs(
  adapter: TemporalAdapter,
  axis: TimelineAxis,
  date: TemporalSupportedObject,
): number {
  if (isFullDayWindow(axis)) {
    return adapter.getTime(date) - adapter.getTime(axis.start);
  }

  const dayMinutes = axis.dayEndMinute - axis.dayStartMinute;
  const dayIndex = adapter.differenceInDays(
    adapter.startOfDay(date),
    adapter.startOfDay(axis.start),
  );
  const minutesInDay = adapter.getHours(date) * 60 + adapter.getMinutes(date);
  const clampedMinutes = Math.min(Math.max(minutesInDay, axis.dayStartMinute), axis.dayEndMinute);

  return (dayIndex * dayMinutes + (clampedMinutes - axis.dayStartMinute)) * MINUTE_MS;
}

/**
 * Whether a date range occupies any space on the axis. A range fully contained in the
 * hidden hours collapses to a zero-width sliver and should not be rendered.
 */
export function isRangeVisibleOnTimelineAxis(
  adapter: TemporalAdapter,
  axis: TimelineAxis,
  rangeStart: TemporalSupportedObject,
  rangeEnd: TemporalSupportedObject,
): boolean {
  if (isFullDayWindow(axis)) {
    return true;
  }

  return (
    dateToTimelineAxisOffsetMs(adapter, axis, rangeEnd) >
    dateToTimelineAxisOffsetMs(adapter, axis, rangeStart)
  );
}
