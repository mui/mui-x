import type { LegendItemParams } from '../ChartsLegend';
import { getLabel } from '../internals/getLabel';
import { LegendGetter } from '../internals/plugins/models';

const legendGetter: LegendGetter<'scatter'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');

    if (formattedLabel === undefined) {
      return acc;
    }

    acc.push({
      markType: series[seriesId].labelMarkType,
      id: seriesId,
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel,
    });
    return acc;
  }, [] as LegendItemParams[]);
};

export default legendGetter;
