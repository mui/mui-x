import type {
  PolarChartSeriesType,
  ChartSeriesDefaultized,
} from '../../../../models/seriesType/config';
import type { AxisConfig } from '../../../../models/axis';
import type { SeriesId } from '../../../../models/seriesType/common';

type PolarExtremumGetterParams<TSeriesType extends PolarChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<TSeriesType>>;
  axis: AxisConfig;
  axisIndex: number;
  isDefaultAxis: boolean;
};

export type PolarExtremumGetterResult = [number, number];

export type PolarExtremumGetter<TSeriesType extends PolarChartSeriesType> = (
  params: PolarExtremumGetterParams<TSeriesType>,
) => PolarExtremumGetterResult;
