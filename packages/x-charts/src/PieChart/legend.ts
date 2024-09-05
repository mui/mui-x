import { LegendItemParams } from '../ChartsLegend/chartsLegend.types';
import { getLabel } from '../internals/getLabel';
import { LegendGetter } from '../context/PluginProvider';

const legendGetter: LegendGetter<'pie'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    series[seriesId].data.forEach((item) => {
      const formattedLabel = getLabel(item.label, 'legend');

      if (formattedLabel === undefined) {
        return;
      }

      acc.push({
        id: item.id,
        seriesId,
        color: item.color,
        label: formattedLabel,
        itemId: item.id,
      });
    });
    return acc;
  }, [] as LegendItemParams[]);
};

export default legendGetter;
