import type { DefaultizedSeriesType } from '../models/seriesType';
import type { ColorCallbackValue } from '../models/seriesType/common';
import type { ChartSeriesType } from '../models/seriesType/config';
import { getSeriesColorFn } from './getSeriesColorFn';

type LineOrBarSeriesType = Extract<ChartSeriesType, 'line' | 'bar' | 'radialLine' | 'radialBar'>;
export interface ResolveColorProcessorParams<SeriesType extends LineOrBarSeriesType, V> {
  series: Pick<DefaultizedSeriesType<SeriesType>, 'color' | 'data' | 'colorGetter'>;
  valueColorScale?: (value: number) => string | null;
  categoryColorScale?: (value: V) => string | null;
  categoryValues?: readonly V[];
}

export function resolveColorProcessor<SeriesType extends LineOrBarSeriesType, V>(
  params: ResolveColorProcessorParams<SeriesType, V>,
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
        value === null
          ? getSeriesColor(fallbackValue)
          : categoryColorScale(value as NonNullable<V>);
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
