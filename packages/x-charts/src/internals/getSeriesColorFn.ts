import { type CommonSeriesType, type ColorCallbackValue } from '../models/seriesType/common';

export function getSeriesColorFn<TValue>(series: {
  color: NonNullable<CommonSeriesType<TValue>['color']>;
  colorGetter?: CommonSeriesType<TValue>['colorGetter'];
}): (data: ColorCallbackValue<TValue>) => string {
  return series.colorGetter ? series.colorGetter : () => series.color;
}
