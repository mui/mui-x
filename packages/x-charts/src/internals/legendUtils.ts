import type { SeriesLegendItemParams } from '../ChartsLegend';
import type { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import type { SeriesProcessorResult } from './plugins/corePlugins/useChartSeriesConfig/types/seriesProcessor.types';
import { getLabel } from './getLabel';

type SeriesTypeWithLegendFields = {
  [T in ChartSeriesType]: ChartSeriesDefaultized<T> extends {
    label?: unknown;
    labelMarkType?: unknown;
    color: string;
  }
    ? T
    : never;
}[ChartSeriesType];

/** One legend item per series. */
export function getSeriesLegendItems<T extends SeriesTypeWithLegendFields>(
  type: T,
  params: SeriesProcessorResult<T>,
  defaultMarkType?: SeriesLegendItemParams['markType'],
): SeriesLegendItemParams[] {
  const { seriesOrder, series } = params;

  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');

    if (formattedLabel === undefined) {
      return acc;
    }

    const s = series[seriesId];
    let markShape: SeriesLegendItemParams['markShape'];
    if ('showMark' in s && s.showMark) {
      markShape = 'shape' in s ? (s.shape ?? 'circle') : 'circle';
    }
    acc.push({
      type,
      markType: s.labelMarkType ?? defaultMarkType,
      markShape,
      seriesId,
      color: s.color,
      label: formattedLabel,
    });
    return acc;
  }, [] as SeriesLegendItemParams[]);
}
