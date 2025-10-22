import { CommonSeriesType } from '../models/seriesType/common';

export function getSeriesColorFn(
  seriesColor: NonNullable<CommonSeriesType<unknown>['color']>,
): (dataIndex?: number) => string {
  return typeof seriesColor === 'function' ? seriesColor : () => seriesColor;
}
