import { type LegendItemParams } from '@mui/x-charts/ChartsLegend';
import { type LegendGetter, getLabel } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'funnel'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    series[seriesId].data.forEach((item, dataIndex) => {
      const formattedLabel = getLabel(item.label, 'legend');

      if (formattedLabel === undefined) {
        return;
      }

      const id = item.id ?? dataIndex;

      acc.push({
        type: 'funnel',
        markType: item.labelMarkType ?? series[seriesId].labelMarkType,
        seriesId,
        itemId: id,
        dataIndex,
        color: item.color,
        label: formattedLabel,
      });
    });

    return acc;
  }, [] as LegendItemParams[]);
};

export default legendGetter;
