import { CommonSeriesType, SeriesColorPropValue } from '../models/seriesType/common';

export function getSeriesColorFn<TValue>(
  seriesColor: NonNullable<CommonSeriesType<TValue>['color']>,
): (data: SeriesColorPropValue<TValue> | null) => string {
  return typeof seriesColor === 'function' ? seriesColor : () => seriesColor;
}
