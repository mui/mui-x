import { NumberValue, scaleTime } from '@mui/x-charts-vendor/d3-scale';
import { AxisConfig } from '../models';
import { ChartsAxisProps } from '../models/axis';

/**
 * Checks if the provided data array contains Date objects.
 * @param data The data array to check.
 * @returns A type predicate indicating if the data is an array of Date objects.
 */
export const isDateData = (data?: readonly any[]): data is Date[] => data?.[0] instanceof Date;

/**
 * Creates a formatter function for date values.
 * @param data The data array containing Date or NumberValue objects.
 * @param range The range for the time scale.
 * @param tickNumber (Optional) The number of ticks for formatting.
 * @returns A formatter function for date values.
 */
export function createDateFormatter(
  data: Iterable<Date | NumberValue>,
  range: number[],
  tickNumber?: number,
): AxisConfig<'band' | 'point', any, ChartsAxisProps>['valueFormatter'] {
  const timeScale = scaleTime(data, range);

  return (v, { location }) =>
    location === 'tick' ? timeScale.tickFormat(tickNumber)(v) : `${v.toLocaleString()}`;
}
