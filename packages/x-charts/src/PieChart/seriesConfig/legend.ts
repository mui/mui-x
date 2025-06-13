import type { LegendItemParams } from '../../ChartsLegend';
import { getLabel } from '../../internals/getLabel';
import { LegendGetter } from '../../internals/plugins/models';

const legendGetter: LegendGetter<'pie'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    series[seriesId].data.forEach((item, dataIndex) => {
      const formattedLabel = getLabel(item.label, 'legend');

      if (formattedLabel === undefined) {
        return;
      }

      acc.push({
        markType: item.labelMarkType ?? series[seriesId].labelMarkType,
        id: item.id ?? dataIndex,
        seriesId,
        color: item.color,
        label: formattedLabel,
        itemId: item.id ?? dataIndex,
      });
    });
    return acc;
  }, [] as LegendItemParams[]);
};

export default legendGetter;
