import type { WeekStartsOn } from '@mui/x-scheduler-internals/models';
import {
  addMonthsToDayNumber,
  getDayNumber,
  getPlainDateWeekStart,
  getStartOfMonthDayNumber,
  getTimelineAxisOffsetMs,
  MS_PER_DAY,
  plainDateFromDayNumber,
} from '@mui/x-scheduler-internals/internals';
import type { BaseTemporal, TimelineAxisWindow } from '@mui/x-scheduler-internals/internals';
import type { IteratedCell, PresetHeaderUnit } from '../../models';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

/**
 * The date of a wall-clock time.
 */
function plainDateFromLocalMs(localMs: number): BaseTemporal.PlainDate {
  return plainDateFromDayNumber(Math.floor(localMs / MS_PER_DAY));
}

/**
 * The range a header walks: its first date, the date after its last one, and the hour window of
 * each day.
 */
export interface IteratedRange extends TimelineAxisWindow {
  startPlainDate: BaseTemporal.PlainDate;
  endPlainDate: BaseTemporal.PlainDate;
}

/**
 * Cells are walked on the wall clock: their bounds are wall-clock times, in milliseconds since
 * 1970-01-01T00:00 of the wall clock, and they hold the dates of those times. A date or an hour
 * that a DST transition skips keeps its cell, as the walk reads no timezone.
 * The hour window of the range only applies when the ticks are hours.
 */
export function iterate(
  unit: PresetHeaderUnit,
  tickUnit: PresetHeaderUnit,
  range: IteratedRange,
  weekStartsOn: WeekStartsOn,
): IteratedCell[] {
  const rangeStartLocalMs = getDayNumber(range.startPlainDate) * MS_PER_DAY;
  const rangeEndLocalMs = getDayNumber(range.endPlainDate) * MS_PER_DAY;
  if (rangeEndLocalMs <= rangeStartLocalMs) {
    throw new Error(
      `MUI X Scheduler: TimelineGridHeader.iterate() received a range whose end date is not after its start date. ` +
        `The iteration would silently produce an empty header, masking the misconfiguration. ` +
        `Check the preset's \`getStartPlainDate\` / \`getEndPlainDate\` so they return ordered dates.`,
    );
  }

  // Hour ticks are a wall-clock grid: every day contributes the same columns whatever
  // its real hours are, so spans are measured on the axis rather than in elapsed hours.
  const appliedHourWindow = tickUnit === 'hour' ? range : undefined;

  // `appliedHourWindow` is only set when the ticks are hours, so this is the hour row.
  if (unit === 'hour' && appliedHourWindow) {
    return iterateHourCells(range);
  }

  const cells: IteratedCell[] = [];
  let cursor = startOf(rangeStartLocalMs, unit, weekStartsOn);
  let index = 0;

  while (cursor < rangeEndLocalMs) {
    // Guard against runaway iteration from a misconfigured preset (e.g. hour ticks over a
    // 100-year range).
    if (index >= 10_000) {
      throwTooManyCells(unit, tickUnit);
    }
    const nextCursor = addUnit(cursor, unit, 1);

    // First and last cells can extend past the visible range (e.g. a year cell
    // aligned to Jan 1 when the range starts mid-year). Clamp them so
    // `spanInTicks` reflects only the portion within `[rangeStartLocalMs, rangeEndLocalMs)`.
    const spanEnd = Math.min(nextCursor, rangeEndLocalMs);
    const spanStart = Math.max(cursor, rangeStartLocalMs);
    cells.push({
      plainDate: plainDateFromLocalMs(cursor),
      firstPlainDate: plainDateFromLocalMs(spanStart),
      // `spanEnd` is exclusive.
      lastPlainDate: plainDateFromLocalMs(spanEnd - 1),
      spanInTicks: appliedHourWindow
        ? countVisibleHours(spanEnd, spanStart, appliedHourWindow)
        : differenceInUnits(spanEnd, spanStart, tickUnit),
      // The wall-clock time of the aligned start.
      key: String(cursor),
      index,
    });
    cursor = nextCursor;
    index += 1;
  }

  return cells;
}

/**
 * Guards against runaway iteration from a misconfigured preset (e.g. hour ticks over a
 * 100-year range).
 */
function throwTooManyCells(unit: PresetHeaderUnit, tickUnit: PresetHeaderUnit): never {
  throw new Error(
    `MUI X Scheduler: TimelineGridHeader.iterate() produced more than 10,000 cells ` +
      `for unit "${unit}" over a range ticked in "${tickUnit}". ` +
      `This usually means the preset's \`unitCount\`/\`timeResolution\` span an unreasonably large period. ` +
      `Reduce \`unitCount\` or pick a coarser \`timeResolution\`.`,
  );
}

/**
 * Emits one cell per displayed wall-clock hour of every day in the range, the same grid
 * the Event Calendar's time axis builds. The columns are decided by arithmetic on the
 * hour window, not by walking real time, so a day keeps its column count across a DST
 * transition: the hour skipped by spring-forward still gets a column and the hour
 * repeated by fall-back gets a single one. Events absorb the difference by stretching or
 * shrinking over the fixed grid.
 */
function iterateHourCells(range: IteratedRange): IteratedCell[] {
  const startHour = Math.ceil(range.dayStartMinute / 60);
  const endHour = Math.ceil(range.dayEndMinute / 60);

  const firstDay = getDayNumber(range.startPlainDate);
  const dayCount = getDayNumber(range.endPlainDate) - firstDay;

  // Same runaway guard as the generic walk, checked up front since the count is known.
  if (dayCount * Math.max(0, endHour - startHour) > 10_000) {
    throwTooManyCells('hour', 'hour');
  }

  const cells: IteratedCell[] = [];
  for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
    const dayStartLocalMs = (firstDay + dayIndex) * MS_PER_DAY;
    const plainDate = plainDateFromDayNumber(firstDay + dayIndex);
    for (let hour = startHour; hour < endHour; hour += 1) {
      cells.push({
        plainDate,
        firstPlainDate: plainDate,
        lastPlainDate: plainDate,
        spanInTicks: 1,
        key: `${dayStartLocalMs}:${hour}`,
        index: cells.length,
        // The hour a spring-forward transition skips has no instant, but keeps its column.
        wallClockHour: hour,
      });
    }
  }

  return cells;
}

/**
 * The wall-clock start of the unit containing `localMs`, a wall-clock time.
 */
function startOf(localMs: number, unit: PresetHeaderUnit, weekStartsOn: WeekStartsOn): number {
  switch (unit) {
    case 'hour':
      return Math.floor(localMs / HOUR_MS) * HOUR_MS;
    case 'day':
      return Math.floor(localMs / MS_PER_DAY) * MS_PER_DAY;
    case 'week':
      return (
        getDayNumber(getPlainDateWeekStart(plainDateFromLocalMs(localMs), weekStartsOn)) *
        MS_PER_DAY
      );
    case 'month':
      return getStartOfMonthDayNumber(Math.floor(localMs / MS_PER_DAY)) * MS_PER_DAY;
    case 'year':
      return getDayNumber(plainDateFromLocalMs(localMs).with({ month: 1, day: 1 })) * MS_PER_DAY;
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

/**
 * Adds units to a wall-clock time. Months and years clamp the day to the last day of the
 * target month.
 */
function addUnit(localMs: number, unit: PresetHeaderUnit, amount: number): number {
  switch (unit) {
    case 'hour':
      return localMs + amount * HOUR_MS;
    case 'day':
      return localMs + amount * MS_PER_DAY;
    case 'week':
      return localMs + amount * 7 * MS_PER_DAY;
    case 'month':
      return addMonths(localMs, amount);
    case 'year':
      return addMonths(localMs, amount * 12);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

/**
 * Adds months to a wall-clock time, keeping its time of day.
 */
function addMonths(localMs: number, months: number): number {
  const dayNumber = Math.floor(localMs / MS_PER_DAY);
  return addMonthsToDayNumber(dayNumber, months) * MS_PER_DAY + (localMs - dayNumber * MS_PER_DAY);
}

/**
 * Counts the hour ticks within `[earlier, later)`, two wall-clock times, that fall inside
 * the visible hour window: the axis distance between the two bounds, in hours. Closed form
 * (no hour-by-hour walk), consistent with the pinned tick count of the grid.
 */
function countVisibleHours(later: number, earlier: number, hourWindow: TimelineAxisWindow): number {
  const toAxisMs = (localMs: number) => {
    const dayNumber = Math.floor(localMs / MS_PER_DAY);
    return getTimelineAxisOffsetMs(hourWindow, dayNumber, localMs - dayNumber * MS_PER_DAY);
  };
  return Math.round((toAxisMs(later) - toAxisMs(earlier)) / HOUR_MS);
}

/**
 * The number of whole months from `earlier` to `later`, two wall-clock times.
 */
function differenceInMonths(later: number, earlier: number): number {
  const laterPlainDate = plainDateFromLocalMs(later);
  const earlierPlainDate = plainDateFromLocalMs(earlier);
  const months =
    (laterPlainDate.year - earlierPlainDate.year) * 12 +
    (laterPlainDate.month - earlierPlainDate.month);
  // A month is whole once the day and the time of `earlier` are reached in it.
  const getTimeInMonth = (localMs: number, day: number) =>
    (day - 1) * MS_PER_DAY + (localMs - Math.floor(localMs / MS_PER_DAY) * MS_PER_DAY);
  const comparison =
    getTimeInMonth(later, laterPlainDate.day) - getTimeInMonth(earlier, earlierPlainDate.day);
  if (months > 0 && comparison < 0) {
    return months - 1;
  }
  if (months < 0 && comparison > 0) {
    return months + 1;
  }
  return months;
}

/**
 * The number of whole units from `earlier` to `later`, two wall-clock times.
 */
function differenceInUnits(later: number, earlier: number, unit: PresetHeaderUnit): number {
  switch (unit) {
    case 'hour':
      return Math.trunc((later - earlier) / HOUR_MS);
    case 'day':
      return Math.trunc((later - earlier) / MS_PER_DAY);
    case 'week':
      return Math.trunc((later - earlier) / (7 * MS_PER_DAY));
    case 'month':
      return differenceInMonths(later, earlier);
    case 'year':
      return Math.trunc(differenceInMonths(later, earlier) / 12);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}
