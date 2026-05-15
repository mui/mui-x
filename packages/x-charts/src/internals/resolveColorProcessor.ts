import type { CommonSeriesType, ColorCallbackValue } from '../models/seriesType/common';
import type { ChartSeriesType } from '../models/seriesType/config';
import { getSeriesColorFn } from './getSeriesColorFn';

export interface ResolveColorProcessorParams<V> {
  series: {
    color: NonNullable<CommonSeriesType<number | null, ChartSeriesType>['color']>;
    data: readonly (number | null)[];
    colorGetter?: CommonSeriesType<number | null, ChartSeriesType>['colorGetter'];
  };
  valueColorScale?: (value: number) => string | null;
  categoryColorScale?: (value: NonNullable<V>) => string | null;
  categoryValues?: readonly V[];
}

export function resolveColorProcessor<V>(
  params: ResolveColorProcessorParams<V>,
): (dataIndex?: number) => string {
  const { series, valueColorScale, categoryColorScale, categoryValues } = params;
  const getSeriesColor = getSeriesColorFn(series);

  if (valueColorScale) {
    return (dataIndex) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = series.data[dataIndex];
      const color = value === null ? getSeriesColor({ value, dataIndex }) : valueColorScale(value);
      if (color === null) {
        return getSeriesColor({ value, dataIndex });
      }
      return color;
    };
  }

  if (categoryColorScale && categoryValues) {
    return (dataIndex) => {
      if (dataIndex === undefined) {
        return series.color;
      }
      const value = categoryValues[dataIndex];
      const fallbackValue: ColorCallbackValue<number | null> = {
        value: series.data[dataIndex],
        dataIndex,
      };
      const color =
        value === null ? getSeriesColor(fallbackValue) : categoryColorScale(value as NonNullable<V>);
      if (color === null) {
        return getSeriesColor(fallbackValue);
      }
      return color;
    };
  }

  return (dataIndex) => {
    if (dataIndex === undefined) {
      return series.color;
    }
    const value = series.data[dataIndex];
    return getSeriesColor({ value, dataIndex });
  };
}
