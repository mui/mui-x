import type {
  PolarChartSeriesType,
  ChartSeriesDefaultized,
} from '../../../../../models/seriesType/config';
import type { AxisConfig } from '../../../../../models/axis';
import type { SeriesId } from '../../../../../models/seriesType/common';

type PolarExtremumGetterParams<SeriesType extends PolarChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<SeriesType>>;
  axis: AxisConfig;
  axisIndex: number;
  isDefaultAxis: boolean;
};

export type PolarExtremumGetterResult = [number, number];

export type PolarExtremumGetter<SeriesType extends PolarChartSeriesType> = (
  params: PolarExtremumGetterParams<SeriesType>,
) => PolarExtremumGetterResult;
