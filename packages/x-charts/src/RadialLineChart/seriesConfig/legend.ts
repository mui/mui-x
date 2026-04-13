import type { SeriesLegendItemParams } from '../../ChartsLegend';
import { getLabel } from '../../internals/getLabel';
import { type LegendGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const legendGetter: LegendGetter<'radial-line'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');

    if (formattedLabel === undefined) {
      return acc;
    }

    acc.push({
      type: 'radial-line',
      markType: series[seriesId].labelMarkType,
      markShape: series[seriesId].showMark ? (series[seriesId].shape ?? 'circle') : undefined,
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel,
    });
    return acc;
  }, [] as SeriesLegendItemParams[]);
};

export default legendGetter;
