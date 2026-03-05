import type { SeriesLegendItemParams } from '../ChartsLegend';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { SeriesProcessorResult } from './plugins/corePlugins/useChartSeriesConfig/types/seriesProcessor.types';
import { getLabel } from './getLabel';

type LegendLabel = Parameters<typeof getLabel>[0];

type SeriesWithSeriesLegend = {
  label?: LegendLabel;
  labelMarkType?: SeriesLegendItemParams['markType'];
  color?: string;
};

function isSeriesWithSeriesLegend(seriesItem: unknown): seriesItem is SeriesWithSeriesLegend {
  return typeof seriesItem === 'object' && seriesItem !== null && 'label' in seriesItem;
}

/** One legend item per series (bar, line, scatter, rangeBar, radar). */
export function getSeriesLegendItems<T extends ChartSeriesType>(
  type: T,
  params: SeriesProcessorResult<T>,
  defaultMarkType?: SeriesLegendItemParams['markType'],
): SeriesLegendItemParams[] {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const seriesItem = series[seriesId];
    if (!isSeriesWithSeriesLegend(seriesItem) || typeof seriesItem.color !== 'string') {
      return acc;
    }
    const formattedLabel = getLabel(seriesItem.label, 'legend');
    if (formattedLabel === undefined) {
      return acc;
    }
    acc.push({
      type,
      markType: seriesItem.labelMarkType ?? defaultMarkType,
      seriesId,
      color: seriesItem.color,
      label: formattedLabel,
    });
    return acc;
  }, [] as SeriesLegendItemParams[]);
}
