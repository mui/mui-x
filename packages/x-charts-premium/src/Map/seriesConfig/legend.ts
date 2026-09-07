import type { SeriesLegendItemParams } from '@mui/x-charts/ChartsLegend';
import { getLabel } from '@mui/x-charts/internals';
import type { LegendGetter } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'mapShape'> = ({ seriesOrder, series }) => {
  return seriesOrder.reduce((acc, seriesId) => {
    const s = series[seriesId];
    const seriesLabel = getLabel(s.label, 'legend');
    if (seriesLabel === undefined) {
      return acc;
    }
    acc.push({
      type: 'mapShape',
      markType: s.labelMarkType,
      seriesId,
      color: s.color,
      label: seriesLabel,
    });
    return acc;
  }, [] as SeriesLegendItemParams[]);
};

export default legendGetter;
