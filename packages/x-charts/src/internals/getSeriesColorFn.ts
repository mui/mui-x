import { CommonSeriesType, SeriesColorGetterValue } from '../models/seriesType/common';

export function getSeriesColorFn<TValue>(series: {
  color: NonNullable<CommonSeriesType<TValue>['color']>;
  colorGetter?: CommonSeriesType<TValue>['colorGetter'];
}): (data: SeriesColorGetterValue<TValue>) => string {
  return series.colorGetter ? series.colorGetter : () => series.color;
}
