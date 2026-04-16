import type {
  ChartsRadiusAxisProps,
  ChartsRotationAxisProps,
  ComputedAxis,
  ComputedXAxis,
  ComputedYAxis,
  ScaleName,
} from '../../../../../models/axis';
import type {
  CartesianChartSeriesType,
  DefaultizedSeriesType,
} from '../../../../../models/seriesType';
import type { ZAxisDefaultized } from '../../../../../models/z-axis';
import type {
  ChartSeriesType,
  PolarChartSeriesType,
} from '../../../../../models/seriesType/config';

/**
 * Map data index to a color.
 * If dataIndex is not defined, it falls back to the series color when defined.
 */
export type ColorGetter<SeriesType extends ChartSeriesType> = SeriesType extends 'pie' | 'funnel'
  ? (dataIndex: number) => string
  : SeriesType extends 'heatmap'
    ? (value: number | null) => string
    : (dataIndex?: number) => string;

type CartesianColorProcessor<SeriesType extends CartesianChartSeriesType> = (
  series: DefaultizedSeriesType<SeriesType>,
  xAxis?: ComputedXAxis,
  yAxis?: ComputedYAxis,
  zAxis?: ZAxisDefaultized,
) => ColorGetter<SeriesType>;

type PolarColorProcessor<SeriesType extends PolarChartSeriesType> = (
  series: DefaultizedSeriesType<SeriesType>,
  rotationAxis?: ComputedAxis<ScaleName, any, ChartsRotationAxisProps>,
  radiusAxis?: ComputedAxis<ScaleName, any, ChartsRadiusAxisProps>,
  zAxis?: ZAxisDefaultized,
) => ColorGetter<SeriesType>;

export type ColorProcessor<SeriesType extends ChartSeriesType> =
  SeriesType extends CartesianChartSeriesType
    ? CartesianColorProcessor<SeriesType>
    : SeriesType extends PolarChartSeriesType
      ? PolarColorProcessor<SeriesType>
      : (series: DefaultizedSeriesType<SeriesType>) => ColorGetter<SeriesType>;
