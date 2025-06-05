import { AxisValueFormatterContext, ContinuousScaleName, D3ContinuousScale } from '../models/axis';

/**
 * Creates a default formatter function for continuous scales (e.g., linear, sqrt, log).
 * @returns A formatter function for continuous values.
 */
export function createScalarFormatter(tickNumber: number, zoomScale: D3ContinuousScale) {
  return function defaultScalarValueFormatter<S extends ContinuousScaleName = ContinuousScaleName>(
    value: any,
    context: AxisValueFormatterContext<S>,
  ): string {
    if (context.location === 'tick') {
      return context.scale.tickFormat(tickNumber)(value);
    }

    if (context.location === 'zoom-slider-tooltip') {
      return zoomScale.tickFormat(2)(value);
    }

    return `${value}`;
  };
}
