import { LegendItemParams } from '@mui/x-charts/ChartsLegend';
import { LegendGetter, getLabel } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'funnel'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');

    if (formattedLabel === undefined) {
      return acc;
    }

    // TODO: Fix type
    acc.push({
      id: seriesId,
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel,
    } as any);
    return acc;
  }, [] as LegendItemParams[]);
};

export default legendGetter;
