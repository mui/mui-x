import { LegendItemConfig } from '../ChartsLegend/chartsLegend.types';
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
        color: item.color,
        label: formattedLabel,
        id: item.id,
        seriesId,
        type: 'pie',
      });
    });
    return acc;
  }, [] as LegendItemConfig[]);
};

export default legendGetter;
