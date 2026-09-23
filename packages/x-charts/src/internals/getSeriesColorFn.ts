import type { ColorCallbackValue, SeriesColor } from '../models/seriesType/common';
import type { ChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';

export function getSeriesColorFn<
  TValue extends ChartsSeriesConfig[ChartSeriesType]['valueType'],
>(series: {
  color: NonNullable<SeriesColor<TValue>['color']>;
  colorGetter?: SeriesColor<TValue>['colorGetter'];
}): (data: ColorCallbackValue<TValue>) => string {
  return series.colorGetter ? series.colorGetter : () => series.color;
}
