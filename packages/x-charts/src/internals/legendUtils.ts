import type { SeriesLegendItemParams } from '../ChartsLegend';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { SeriesProcessorResult } from './plugins/corePlugins/useChartSeriesConfig/types/seriesProcessor.types';
import { getLabel } from './getLabel';

type LegendLabel = Parameters<typeof getLabel>[0];

type SeriesWithSeriesLegend = {
  label?: LegendLabel;
  labelMarkType?: SeriesLegendItemParams['markType'];
  color: string;
};

function isSeriesWithSeriesLegend(seriesItem: unknown): seriesItem is SeriesWithSeriesLegend {
  return (
    typeof seriesItem === 'object' &&
    seriesItem !== null &&
    'label' in seriesItem &&
    'color' in seriesItem &&
    typeof seriesItem.color === 'string'
  );
}

/** One legend item per series (bar, line, scatter, rangeBar, radar). */
export function getSeriesLegendItems<T extends ChartSeriesType>(
  type: T,
  params: SeriesProcessorResult<T>,
  defaultMarkType?: SeriesLegendItemParams['markType'],
): SeriesLegendItemParams[] {
  const { seriesOrder, series } = params;
  const legendItems: SeriesLegendItemParams[] = [];

  for (let i = 0; i < seriesOrder.length; i += 1) {
    const seriesId = seriesOrder[i];
    const seriesItem = series[seriesId];
    if (!isSeriesWithSeriesLegend(seriesItem)) {
      continue;
    }

    const formattedLabel = getLabel(seriesItem.label, 'legend');
    if (formattedLabel === undefined) {
      continue;
    }

    legendItems.push({
      type,
      markType: seriesItem.labelMarkType ?? defaultMarkType,
      seriesId,
      color: seriesItem.color,
      label: formattedLabel,
    });
  }

  return legendItems;
}
