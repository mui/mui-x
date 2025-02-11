import type {
  CartesianChartSeriesType,
  ChartSeriesDefaultized,
} from '../../../../models/seriesType/config';
import type { AxisConfig, AxisId } from '../../../../models/axis';
import type { SeriesId } from '../../../../models/seriesType/common';

type CartesianExtremumGetterParams<TSeriesType extends CartesianChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<TSeriesType>>;
  axis: AxisConfig;
  axisIndex: number;
  isDefaultAxis: boolean;
  getFilters?: (params: {
    currentAxisId: AxisId | undefined;
    seriesXAxisId?: AxisId;
    seriesYAxisId?: AxisId;
    isDefaultAxis: boolean;
  }) => CartesianExtremumFilter;
};

export type CartesianExtremumGetterResult = [number, number];

export type CartesianExtremumGetter<TSeriesType extends CartesianChartSeriesType> = (
  params: CartesianExtremumGetterParams<TSeriesType>,
) => CartesianExtremumGetterResult;

export type CartesianExtremumFilter = (
  value: { x: number | Date | string | null; y: number | Date | string | null },
  dataIndex: number,
) => boolean;
