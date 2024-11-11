import { LegendItemParams } from '../ChartsLegend/chartsLegend.types';
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
      id: seriesId,
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel,
    });

    return acc;
  }, [] as LegendItemParams[]);
};

export default legendGetter;
