import { AxisValueFormatterContext, ScaleName } from '../models/axis';

/**
 * Creates a default formatter function for continuous scales (e.g., linear, sqrt, log).
 * @returns A formatter function for continuous values.
 */
export function createScalarFormatter(tickNumber: number) {
  return function defaultScalarValueFormatter<S extends ScaleName = ScaleName>(
    value: any,
    context: AxisValueFormatterContext<S>,
  ): string {
    if (
      (context.location === 'tick' || context.location === 'zoom-slider-tooltip') &&
      'tickFormat' in context.scale
    ) {
      return context.scale.tickFormat(tickNumber)(value);
    }

    return `${value}`;
  };
}
