import type {
  TemporalAdapter,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/base-ui-copy';
import type { WeekStartsOn } from '@mui/x-scheduler-internals/models';
import { getStartOfWeek } from '@mui/x-scheduler-internals/internals';
import type { IteratedCell, PresetHeaderUnit } from '../../models';

export function iterate(
  adapter: TemporalAdapter,
  unit: PresetHeaderUnit,
  tickUnit: PresetHeaderUnit,
  rangeStart: TemporalSupportedObject,
  rangeEnd: TemporalSupportedObject,
  weekStartsOn?: WeekStartsOn,
  hourRange?: { startTime: number; endTime: number },
): IteratedCell[] {
  if (adapter.isBefore(rangeEnd, rangeStart)) {
    throw new Error(
      `MUI X Scheduler: TimelineGridHeader.iterate() received a range where rangeEnd is before rangeStart. ` +
        `The iteration would silently produce an empty header, masking the misconfiguration. ` +
        `Check the preset's \`getStartDate\` / \`getEndDate\` so they return ordered dates.`,
    );
  }

  // `rangeEnd` is inclusive (e.g. `endOfDay` = 23:59:59.999). Floor it to the
  // tick boundary and add one tick to get an exclusive end the loop can compare
  // against without depending on millisecond precision.
  const rangeEndExclusive = addUnit(
    adapter,
    startOf(adapter, rangeEnd, tickUnit, weekStartsOn),
    tickUnit,
    1,
  );

  // The hour range only trims hour ticks: hidden hour cells are skipped and the
  // spans of coarser cells count visible hours only.
  const appliedHourRange =
    tickUnit === 'hour' && hourRange && !(hourRange.startTime === 0 && hourRange.endTime === 24)
      ? hourRange
      : undefined;

  const cells: IteratedCell[] = [];
  let cursor = startOf(adapter, rangeStart, unit, weekStartsOn);
  let index = 0;

  while (adapter.isBefore(cursor, rangeEndExclusive)) {
    // Guard against runaway iteration from a misconfigured preset (e.g. hour ticks over a
    // 100-year range).
    if (index >= 10_000) {
      throw new Error(
        `MUI X Scheduler: TimelineGridHeader.iterate() produced more than 10,000 cells ` +
          `for unit "${unit}" over a range ticked in "${tickUnit}". ` +
          `This usually means the preset's \`unitCount\`/\`timeResolution\` span an unreasonably large period. ` +
          `Reduce \`unitCount\` or pick a coarser \`timeResolution\`.`,
      );
    }
    const nextCursor = addUnit(adapter, cursor, unit, 1);

    if (appliedHourRange && unit === 'hour') {
      const hour = adapter.getHours(cursor);
      if (hour < appliedHourRange.startTime || hour >= appliedHourRange.endTime) {
        cursor = nextCursor;
        continue;
      }
    }

    // First and last cells can extend past the visible range (e.g. a year cell
    // aligned to Jan 1 when the range starts mid-year). Clamp them so
    // `spanInTicks` reflects only the portion within `[rangeStart, rangeEndExclusive)`.
    const clampedStart = adapter.isBefore(cursor, rangeStart) ? rangeStart : cursor;
    const clampedEnd = adapter.isBefore(rangeEndExclusive, nextCursor)
      ? rangeEndExclusive
      : nextCursor;
    cells.push({
      date: cursor,
      start: clampedStart,
      end: clampedEnd,
      spanInTicks: appliedHourRange
        ? countVisibleHours(adapter, clampedEnd, clampedStart, appliedHourRange)
        : differenceInUnits(adapter, clampedEnd, clampedStart, tickUnit),
      key: String(adapter.getTime(cursor)),
      index,
    });
    cursor = nextCursor;
    index += 1;
  }

  return cells;
}

function startOf(
  adapter: TemporalAdapter,
  date: TemporalSupportedObject,
  unit: PresetHeaderUnit,
  weekStartsOn?: WeekStartsOn,
): TemporalSupportedObject {
  switch (unit) {
    case 'hour':
      return adapter.startOfHour(date);
    case 'day':
      return adapter.startOfDay(date);
    case 'week':
      return getStartOfWeek(adapter, date, weekStartsOn);
    case 'month':
      return adapter.startOfMonth(date);
    case 'year':
      return adapter.startOfYear(date);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

function addUnit(
  adapter: TemporalAdapter,
  date: TemporalSupportedObject,
  unit: PresetHeaderUnit,
  amount: number,
): TemporalSupportedObject {
  switch (unit) {
    case 'hour':
      return adapter.addHours(date, amount);
    case 'day':
      return adapter.addDays(date, amount);
    case 'week':
      return adapter.addWeeks(date, amount);
    case 'month':
      return adapter.addMonths(date, amount);
    case 'year':
      return adapter.addYears(date, amount);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}

/**
 * Counts the hour ticks within `[earlier, later)` that fall inside the visible hour range.
 */
function countVisibleHours(
  adapter: TemporalAdapter,
  later: TemporalSupportedObject,
  earlier: TemporalSupportedObject,
  hourRange: { startTime: number; endTime: number },
): number {
  let count = 0;
  let cursor = earlier;
  while (adapter.isBefore(cursor, later)) {
    const hour = adapter.getHours(cursor);
    if (hour >= hourRange.startTime && hour < hourRange.endTime) {
      count += 1;
    }
    cursor = adapter.addHours(cursor, 1);
  }
  return count;
}

function differenceInUnits(
  adapter: TemporalAdapter,
  later: TemporalSupportedObject,
  earlier: TemporalSupportedObject,
  unit: PresetHeaderUnit,
): number {
  switch (unit) {
    case 'hour':
      return adapter.differenceInHours(later, earlier);
    case 'day':
      return adapter.differenceInDays(later, earlier);
    case 'week':
      return adapter.differenceInWeeks(later, earlier);
    case 'month':
      return adapter.differenceInMonths(later, earlier);
    case 'year':
      return adapter.differenceInYears(later, earlier);
    default:
      throw new Error(
        `MUI X Scheduler: Unsupported header unit "${unit}". ` +
          `TimelineGridHeader cannot iterate cells for an unknown unit, so the header would render incorrectly. ` +
          `Use one of: 'hour', 'day', 'week', 'month', 'year'.`,
      );
  }
}
