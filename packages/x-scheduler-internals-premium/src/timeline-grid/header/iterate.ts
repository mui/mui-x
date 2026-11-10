import type { WeekStartsOn } from '@mui/x-scheduler-internals/models';
import {
  addMonthsToDayNumber,
  getDayNumber,
  getStartOfMonthDayNumber,
  getStartOfWeekDayNumber,
  getStartOfYearDayNumber,
  plainDateFromDayNumber,
} from '@mui/x-scheduler-internals/internals';
import type { BaseTemporal, TimelineAxisWindow } from '@mui/x-scheduler-internals/internals';
import type { IteratedCell, PresetHeaderUnit } from '../../models';

type DayHeaderUnit = Exclude<PresetHeaderUnit, 'hour'>;

/**
 * The range a header walks: its first date, the date after its last one, and the hour window of
 * each day.
 */
export interface IteratedRange extends TimelineAxisWindow {
  startPlainDate: BaseTemporal.PlainDate;
  endPlainDate: BaseTemporal.PlainDate;
}

/**
 * The wall-clock hours of the hour window, from `startHour` (inclusive) to `endHour` (exclusive):
 * the hour columns of every day when the ticks are hours.
 */
function getHourWindow(range: TimelineAxisWindow) {
  return {
    startHour: Math.ceil(range.dayStartMinute / 60),
    endHour: Math.ceil(range.dayEndMinute / 60),
  };
}

/**
 * Cells are walked on the day numbers of the dates of the range. A date or an hour that a DST
 * transition skips keeps its cell, as the walk reads no timezone.
 * The hour window of the range only applies to the hour cells and the hour ticks.
 */
export function iterate(
  unit: PresetHeaderUnit,
  tickUnit: PresetHeaderUnit,
  range: IteratedRange,
  weekStartsOn: WeekStartsOn,
): IteratedCell[] {
  const rangeStart = getDayNumber(range.startPlainDate);
  const rangeEnd = getDayNumber(range.endPlainDate);
  if (rangeEnd <= rangeStart) {
    throw new Error(
      `MUI X Scheduler: TimelineGridHeader.iterate() received a range whose end date is not after its start date. ` +
        `The iteration would silently produce an empty header, masking the misconfiguration. ` +
        `Check the preset's \`getStartPlainDate\` / \`getEndPlainDate\` so they return ordered dates.`,
    );
  }

  if (unit === 'hour') {
    return iterateHourCells(range);
  }

  // Hour ticks are a wall-clock grid: every day contributes the same columns whatever its real
  // hours are, so a cell spans the hour columns of its days rather than its elapsed hours.
  const { startHour, endHour } = getHourWindow(range);
  const hoursPerDay = endHour - startHour;

  const cells: IteratedCell[] = [];
  let cursor = startOf(rangeStart, unit, weekStartsOn);

  while (cursor < rangeEnd) {
    if (cells.length >= 10_000) {
      throwTooManyCells(unit, tickUnit);
    }
    const nextCursor = addUnit(cursor, unit);

    // First and last cells can extend past the visible range (e.g. a year cell
    // aligned to Jan 1 when the range starts mid-year). Clamp them so
    // `spanInTicks` reflects only the portion within `[rangeStart, rangeEnd)`.
    const spanEnd = Math.min(nextCursor, rangeEnd);
    const spanStart = Math.max(cursor, rangeStart);
    cells.push({
      plainDate: plainDateFromDayNumber(cursor),
      firstPlainDate: plainDateFromDayNumber(spanStart),
      // `spanEnd` is exclusive.
      lastPlainDate: plainDateFromDayNumber(spanEnd - 1),
      spanInTicks:
        tickUnit === 'hour'
          ? (spanEnd - spanStart) * hoursPerDay
          : differenceInUnits(spanEnd, spanStart, tickUnit),
      // The day number of the aligned start.
      key: String(cursor),
      index: cells.length,
    });
    cursor = nextCursor;
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
  const { startHour, endHour } = getHourWindow(range);

  const firstDay = getDayNumber(range.startPlainDate);
  const dayCount = getDayNumber(range.endPlainDate) - firstDay;

  // Same runaway guard as the generic walk, checked up front since the count is known.
  if (dayCount * (endHour - startHour) > 10_000) {
    throwTooManyCells('hour', 'hour');
  }

  const cells: IteratedCell[] = [];
  for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
    const dayNumber = firstDay + dayIndex;
    const plainDate = plainDateFromDayNumber(dayNumber);
    for (let hour = startHour; hour < endHour; hour += 1) {
      cells.push({
        plainDate,
        firstPlainDate: plainDate,
        lastPlainDate: plainDate,
        spanInTicks: 1,
        key: `${dayNumber}:${hour}`,
        index: cells.length,
        // The hour a spring-forward transition skips has no instant, but keeps its column.
        wallClockHour: hour,
      });
    }
  }

  return cells;
}

/**
 * The day number of the start of the unit containing `dayNumber`.
 */
function startOf(dayNumber: number, unit: DayHeaderUnit, weekStartsOn: WeekStartsOn): number {
  switch (unit) {
    case 'day':
      return dayNumber;
    case 'week':
      return getStartOfWeekDayNumber(dayNumber, weekStartsOn);
    case 'month':
      return getStartOfMonthDayNumber(dayNumber);
    case 'year':
      return getStartOfYearDayNumber(dayNumber);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

/**
 * The day number of the start of the unit after the one starting on `dayNumber`.
 */
function addUnit(dayNumber: number, unit: DayHeaderUnit): number {
  switch (unit) {
    case 'day':
      return dayNumber + 1;
    case 'week':
      return dayNumber + 7;
    case 'month':
      return addMonthsToDayNumber(dayNumber, 1);
    case 'year':
      return addMonthsToDayNumber(dayNumber, 12);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

/**
 * The number of whole months from the day number `earlier` to the later day number `later`.
 */
function differenceInMonths(later: number, earlier: number): number {
  const laterPlainDate = plainDateFromDayNumber(later);
  const earlierPlainDate = plainDateFromDayNumber(earlier);
  const months =
    (laterPlainDate.year - earlierPlainDate.year) * 12 +
    (laterPlainDate.month - earlierPlainDate.month);
  // A month is whole once the day of `earlier` is reached in it.
  return laterPlainDate.day < earlierPlainDate.day ? months - 1 : months;
}

/**
 * The number of whole units from the day number `earlier` to the later day number `later`.
 */
function differenceInUnits(later: number, earlier: number, unit: DayHeaderUnit): number {
  switch (unit) {
    case 'day':
      return later - earlier;
    case 'week':
      return Math.floor((later - earlier) / 7);
    case 'month':
      return differenceInMonths(later, earlier);
    case 'year':
      return Math.floor(differenceInMonths(later, earlier) / 12);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}
