import { type CommonSeriesType, type ColorCallbackValue } from '../models/seriesType/common';
import { ChartSeriesType } from '../models/seriesType/config';

export function getSeriesColorFn<TValue>(series: {
  color: NonNullable<CommonSeriesType<TValue, ChartSeriesType>['color']>;
  colorGetter?: CommonSeriesType<TValue, ChartSeriesType>['colorGetter'];
}): (data: ColorCallbackValue<TValue>) => string {
  return series.colorGetter ? series.colorGetter : () => series.color;
}
