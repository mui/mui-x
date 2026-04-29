import type { SeriesLegendItemParams } from '../ChartsLegend';
import type { ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';
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

function getMarkShape(
  series: { showMark?: boolean; shape?: ChartsLabelMarkProps['markShape'] },
): SeriesLegendItemParams['markShape'] {
  return series.showMark ? (series.shape ?? 'circle') : undefined;
}

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

    acc.push({
      type,
      markType: series[seriesId].labelMarkType ?? defaultMarkType,
      markShape: getMarkShape(series[seriesId]),
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel,
    });
    return acc;
  }, [] as SeriesLegendItemParams[]);
}
