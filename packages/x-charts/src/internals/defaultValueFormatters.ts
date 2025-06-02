import { AxisValueFormatterContext, ContinuousScaleName } from '../models/axis';

const numberFormatter = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 2 });

/**
 * Creates a default formatter function for continuous scales (e.g., linear, sqrt, log).
 * @returns A formatter function for continuous values.
 */
export function createScalarFormatter(tickNumber: number) {
  return function defaultScalarValueFormatter<S extends ContinuousScaleName = ContinuousScaleName>(
    value: any,
    context: AxisValueFormatterContext<S>,
  ): string {
    if (context.location === 'tick') {
      return context.scale.tickFormat(tickNumber)(value);
    }

    if (context.location === 'zoom-slider-tooltip' && typeof value === 'number') {
      return numberFormatter.format(value);
    }

    return `${value}`;
  };
}
