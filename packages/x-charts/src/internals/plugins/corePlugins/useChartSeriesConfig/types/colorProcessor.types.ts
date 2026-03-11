import type { ComputedXAxis, ComputedYAxis } from '../../../../../models/axis';
import type { DefaultizedSeriesType } from '../../../../../models/seriesType';
import type { ZAxisDefaultized } from '../../../../../models/z-axis';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';

/**
 * Map data index to a color.
 * If dataIndex is not defined, it falls back to the series color when defined.
 */
export type ColorGetter<SeriesType extends ChartSeriesType> = SeriesType extends 'pie' | 'funnel'
  ? (dataIndex: number) => string
  : SeriesType extends 'heatmap'
    ? (value: number | null) => string
    : (dataIndex?: number) => string;

/**
 * Transforms charts config to a color getter.
 * If dataIndex is not defined, it falls back to the series color.
 * @param {DefaultizedSeriesType<SeriesType>} series - The series configuration.
 * @param {ComputedXAxis | undefined} xAxis - The computed x-axis configuration.
 * @param {ComputedYAxis | undefined} yAxis - The computed y-axis configuration.
 * @param {ZAxisDefaultized | undefined} zAxis - The defaulted z-axis configuration.
 * @returns {ColorGetter<SeriesType>} A function that takes a data index and returns a color string.
 */
export type ColorProcessor<SeriesType extends ChartSeriesType> = (
  series: DefaultizedSeriesType<SeriesType>,
  xAxis?: ComputedXAxis,
  yAxis?: ComputedYAxis,
  zAxis?: ZAxisDefaultized,
) => ColorGetter<SeriesType>;
