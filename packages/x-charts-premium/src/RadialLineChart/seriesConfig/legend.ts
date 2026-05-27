import type { SeriesLegendItemParams } from '@mui/x-charts/ChartsLegend';
import { getLabel, type LegendGetter } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'radialLine'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');

    if (formattedLabel === undefined) {
      return acc;
    }

    acc.push({
      type: 'radialLine',
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
