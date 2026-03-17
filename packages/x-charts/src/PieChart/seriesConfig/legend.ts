import type { LegendItemParams } from '../../ChartsLegend';
import { getLabel } from '../../internals/getLabel';
import { type LegendGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const legendGetter: LegendGetter<'pie'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    series[seriesId].data.forEach((item, dataIndex) => {
      const formattedLabel = getLabel(item.label, 'legend');

      if (formattedLabel === undefined) {
        return;
      }

      const id = item.id ?? dataIndex;

      acc.push({
        type: 'pie',
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
