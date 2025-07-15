import { LegendItemParams } from '@mui/x-charts/ChartsLegend';
import { LegendGetter, getLabel } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'funnel'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    series[seriesId].data.forEach((item) => {
      const formattedLabel = getLabel(item.label, 'legend');

      if (formattedLabel === undefined) {
        return;
      }

      acc.push({
        markType: item.labelMarkType ?? series[seriesId].labelMarkType,
        seriesId,
        id: item.id,
        itemId: item.id,
        color: item.color,
        label: formattedLabel,
      });
    });

    return acc;
  }, [] as LegendItemParams[]);
};

export default legendGetter;
