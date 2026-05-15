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

/** One legend item per series (bar, scatter, rangeBar, radar). */
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

    acc.push({
      type,
      markType: series[seriesId].labelMarkType ?? defaultMarkType,
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel,
    });
    return acc;
  }, [] as SeriesLegendItemParams[]);
}
