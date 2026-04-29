import { TemporalAdapter, TemporalSupportedObject } from '@mui/x-scheduler-headless/base-ui-copy';
import { IteratedCell, PresetHeaderUnit } from '../../models';

export function iterate(
  adapter: TemporalAdapter,
  unit: PresetHeaderUnit,
  tickUnit: PresetHeaderUnit,
  rangeStart: TemporalSupportedObject,
  rangeEnd: TemporalSupportedObject,
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
  const rangeEndExclusive = addUnit(adapter, startOf(adapter, rangeEnd, tickUnit), tickUnit, 1);

  const cells: IteratedCell[] = [];
  let cursor = startOf(adapter, rangeStart, unit);
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
      spanInTicks: differenceInUnits(adapter, clampedEnd, clampedStart, tickUnit),
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
): TemporalSupportedObject {
  switch (unit) {
    case 'hour':
      return adapter.startOfHour(date);
    case 'day':
      return adapter.startOfDay(date);
    case 'week':
      return adapter.startOfWeek(date);
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
