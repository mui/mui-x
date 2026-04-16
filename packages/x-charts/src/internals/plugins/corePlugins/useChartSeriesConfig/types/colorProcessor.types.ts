import type {
  ChartsRadiusAxisProps,
  ChartsRotationAxisProps,
  ComputedAxis,
  ComputedXAxis,
  ComputedYAxis,
  ScaleName,
} from '../../../../../models/axis';
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

export type ColorProcessor<SeriesType extends ChartSeriesType> = (
  series: DefaultizedSeriesType<SeriesType>,
  /**
   * Either the x-axis or rotation-axis, depending on the coordinate system.
   */
  mainAxis?: ComputedXAxis | ComputedAxis<ScaleName, any, ChartsRotationAxisProps>,
  /**
   * Either the y-axis or radius-axis, depending on the coordinate system.
   */
  secondaryAxis?: ComputedYAxis | ComputedAxis<ScaleName, any, ChartsRadiusAxisProps>,
  zAxis?: ZAxisDefaultized,
) => ColorGetter<SeriesType>;
