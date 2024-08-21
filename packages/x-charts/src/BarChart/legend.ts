import { LegendItemConfig } from '../ChartsLegend/chartsLegend.types';
import { LegendGetter } from '../context/PluginProvider';
import { getLabel } from '../internals/getLabel';

const legendGetter: LegendGetter<'bar'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');

    if (formattedLabel === undefined) {
      return acc;
    }

    acc.push({
      color: series[seriesId].color,
      label: formattedLabel,
      id: seriesId,
      type: 'series',
      seriesId,
    });
    return acc;
  }, [] as LegendItemConfig[]);
};

export default legendGetter;
