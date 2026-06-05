import { type CommonSeriesType, type ColorCallbackValue } from '../models/seriesType/common';
import { type ChartSeriesType, type ChartsSeriesConfig } from '../models/seriesType/config';

export function getSeriesColorFn<
  TValue extends ChartsSeriesConfig[ChartSeriesType]['valueType'],
>(series: {
  color: NonNullable<CommonSeriesType<ChartSeriesType>['color']>;
  colorGetter?: CommonSeriesType<ChartSeriesType>['colorGetter'];
}): (data: ColorCallbackValue<TValue>) => string {
  return series.colorGetter ? series.colorGetter : () => series.color;
}
