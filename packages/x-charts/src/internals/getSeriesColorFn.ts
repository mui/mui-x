import { type CommonSeriesType, type ColorCallbackValue } from '../models/seriesType/common';

export function getSeriesColorFn<TValue>(series: {
  color: NonNullable<CommonSeriesType<TValue, any>['color']>;
  colorGetter?: CommonSeriesType<TValue, any>['colorGetter'];
}): (data: ColorCallbackValue<TValue>) => string {
  return series.colorGetter ? series.colorGetter : () => series.color;
}
