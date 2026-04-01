/**
 * A calendar interval unit for range buttons.
 */
export type RangeButtonIntervalUnit =
  | 'microsecond'
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';

/**
 * Defines the value of a range button.
 *
 * - `{ unit, step }` — A calendar interval from the end of the data (e.g., `{ unit: 'month', step: 3 }` for 3 months).
 * - `[start, end]` — An absolute date range.
 * - `(domainMin, domainMax, zoomedMin, zoomedMax) => { start, end }` — A function that receives the full axis domain bounds and the current zoomed-in bounds (as timestamps) and returns zoom percentages (0-100).
 * - `null` — Resets zoom to show all data.
 */
export type RangeButtonValue =
  | { unit: RangeButtonIntervalUnit; step?: number }
  | [Date, Date]
  | ((
      domainMin: number,
      domainMax: number,
      zoomedMin: number,
      zoomedMax: number,
    ) => { start: number; end: number })
  | null;

/**
 * Converts a range button value to zoom start/end percentages.
 *
 * The range is calculated from the end of the axis domain.
 * For example, `{ unit: 'month', step: 3 }` will zoom to show the last 3 months of data.
 *
 * @param value The range button value.
 * @param domainMin The minimum value of the full axis domain (timestamp).
 * @param domainMax The maximum value of the full axis domain (timestamp).
 * @param zoomedMin The minimum value of the current zoomed-in range (timestamp).
 * @param zoomedMax The maximum value of the current zoomed-in range (timestamp).
 * @returns The zoom start and end percentages (0-100).
 */
export function rangeButtonValueToZoom(
  value: RangeButtonValue,
  domainMin: number,
  domainMax: number,
  zoomedMin: number,
  zoomedMax: number,
): { start: number; end: number } {
  if (value === null) {
    return { start: 0, end: 100 };
  }

  if (typeof value === 'function') {
    return value(domainMin, domainMax, zoomedMin, zoomedMax);
  }

  const domainRange = domainMax - domainMin;
  if (domainRange <= 0) {
    return { start: 0, end: 100 };
  }

  // Absolute date range
  if (Array.isArray(value)) {
    const [rangeStart, rangeEnd] = value;
    const startPercent = ((rangeStart.getTime() - domainMin) / domainRange) * 100;
    const endPercent = ((rangeEnd.getTime() - domainMin) / domainRange) * 100;
    return {
      start: Math.max(0, Math.min(100, startPercent)),
      end: Math.max(0, Math.min(100, endPercent)),
    };
  }

  // Interval — subtract from the end of the domain
  const { unit, step = 1 } = value;
  let targetStartMs: number;

  switch (unit) {
    case 'year': {
      const d = new Date(domainMax);
      d.setFullYear(d.getFullYear() - step);
      targetStartMs = d.getTime();
      break;
    }
    case 'month': {
      const d = new Date(domainMax);
      d.setMonth(d.getMonth() - step);
      targetStartMs = d.getTime();
      break;
    }
    case 'week':
      targetStartMs = domainMax - step * 7 * 24 * 60 * 60 * 1000;
      break;
    case 'day':
      targetStartMs = domainMax - step * 24 * 60 * 60 * 1000;
      break;
    case 'hour':
      targetStartMs = domainMax - step * 60 * 60 * 1000;
      break;
    case 'minute':
      targetStartMs = domainMax - step * 60 * 1000;
      break;
    case 'second':
      targetStartMs = domainMax - step * 1000;
      break;
    case 'millisecond':
      targetStartMs = domainMax - step;
      break;
    case 'microsecond':
      targetStartMs = domainMax - step / 1000;
      break;
    default:
      targetStartMs = domainMin;
      break;
  }

  const startPercent = Math.max(0, ((targetStartMs - domainMin) / domainRange) * 100);

  return { start: startPercent, end: 100 };
}

/**
 * Checks if a range button's zoom matches the current zoom state.
 *
 * @param value The range button value.
 * @param currentZoom The current zoom data for the axis.
 * @param domainMin The minimum value of the full axis domain (timestamp).
 * @param domainMax The maximum value of the full axis domain (timestamp).
 * @param zoomedMin The minimum value of the current zoomed-in range (timestamp).
 * @param zoomedMax The maximum value of the current zoomed-in range (timestamp).
 * @param tolerance The tolerance for floating-point comparison (default 0.01).
 * @returns Whether the range button is currently active.
 */
export function isRangeButtonActive(
  value: RangeButtonValue,
  currentZoom: { start: number; end: number },
  domainMin: number,
  domainMax: number,
  zoomedMin: number,
  zoomedMax: number,
  tolerance: number = 0.01,
): boolean {
  const target = rangeButtonValueToZoom(value, domainMin, domainMax, zoomedMin, zoomedMax);
  return (
    Math.abs(currentZoom.start - target.start) <= tolerance &&
    Math.abs(currentZoom.end - target.end) <= tolerance
  );
}
