import { AxisValueFormatterContext, ContinuousScaleName } from '../models/axis';

/**
 * Creates a default formatter function for continuous scales (e.g., linear, sqrt, log).
 * @returns A formatter function for continuous values.
 */
export function createScalarFormatter<
  S extends ContinuousScaleName = ContinuousScaleName,
  V extends any = any,
>(tickNumber: number) {
  return function defaultScalarValueFormatter(
    value: V,
    context: AxisValueFormatterContext<S>,
  ): string {
    if (context.location === 'tick' || context.location === 'zoom-slider-tooltip') {
      return context.scale.tickFormat(tickNumber)(value);
    }

    return `${value}`;
  };
}
