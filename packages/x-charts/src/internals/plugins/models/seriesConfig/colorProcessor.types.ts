import type { ComputedAxis } from '../../../../models/axis';
import type { DefaultizedSeriesType } from '../../../../models/seriesType';
import type { ZAxisDefaultized } from '../../../../models/z-axis';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

/**
 * Map data index to a color.
 * If dataIndex is not defined, it falls back to the series color when defined.
 */
export type ColorGetter<TSeriesType extends ChartSeriesType> = TSeriesType extends
  | 'pie'
  | 'funnel'
  | 'heatmap'
  ? (dataIndex: number) => string
  : (dataIndex?: number) => string;

/**
 * Transforms charts config to a color getter.
 * If dataIndex is not defined, it falls back to the series color.
 */
export type ColorProcessor<TSeriesType extends ChartSeriesType> = (
  series: DefaultizedSeriesType<TSeriesType>,
  xAxis?: ComputedAxis,
  yAxis?: ComputedAxis,
  zAxis?: ZAxisDefaultized,
) => ColorGetter<TSeriesType>;
