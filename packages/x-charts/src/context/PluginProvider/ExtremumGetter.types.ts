import type {
  CartesianChartSeriesType,
  ChartSeries,
  ChartSeriesType,
} from '../../models/seriesType/config';
import type { AxisConfig } from '../../models/axis';
import type { SeriesId } from '../../models/seriesType/common';

export type ExtremumGettersConfig<T extends ChartSeriesType = CartesianChartSeriesType> = {
  [K in T]?: ExtremumGetter<K>;
};

type ExtremumGetterParams<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeries<T>>;
  axis: AxisConfig;
  isDefaultAxis: boolean;
};

export type ExtremumGetterResult = [number, number] | [null, null];

export type ExtremumGetter<T extends ChartSeriesType> = (
  params: ExtremumGetterParams<T>,
) => ExtremumGetterResult;
