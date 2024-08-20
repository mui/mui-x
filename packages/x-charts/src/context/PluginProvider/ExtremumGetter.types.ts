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
  getFilters?: (params: {
    currentAxisId: AxisId | undefined;
    seriesXAxisId?: AxisId;
    seriesYAxisId?: AxisId;
    isDefaultAxis: boolean;
  }) => ExtremumFilter;
};

export type ExtremumGetterResult = [number, number];

export type ExtremumGetter<T extends ChartSeriesType> = (
  params: ExtremumGetterParams<T>,
) => ExtremumGetterResult;

export type ExtremumFilter = (
  value: { x: number | Date | string | null; y: number | Date | string | null },
  dataIndex: number,
) => boolean;
