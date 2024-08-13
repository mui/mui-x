import type {
  CartesianChartSeriesType,
  ChartSeries,
  ChartSeriesType,
} from '../../models/seriesType/config';
import type { AxisConfig, AxisId } from '../../models/axis';
import type { SeriesId } from '../../models/seriesType/common';

export type ExtremumGettersConfig<T extends ChartSeriesType = CartesianChartSeriesType> = {
  [K in T]?: ExtremumGetter<K>;
};

type ExtremumGetterParams<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeries<T>>;
  axis: AxisConfig;
  isDefaultAxis: boolean;
  getZoomFilters?: (params: {
    currentAxisId: AxisId | undefined;
    seriesXAxisId?: AxisId;
    seriesYAxisId?: AxisId;
    isDefaultAxis: boolean;
  }) => (v: number | Date | string | null, i: number) => boolean;
};

export type ExtremumGetterResult = [number, number];

export type ExtremumGetter<T extends ChartSeriesType> = (
  params: ExtremumGetterParams<T>,
) => ExtremumGetterResult;
