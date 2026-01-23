import type { LegendItemParams } from '../../../ChartsLegend';
import { getLabel } from '../../../internals/getLabel';
import type { LegendGetter } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

const legendGetter: LegendGetter<'bar'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');

    if (formattedLabel === undefined) {
      return acc;
    }

    acc.push({
      type: 'bar',
      markType: series[seriesId].labelMarkType,
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel,
    });

    return acc;
  }, [] as LegendItemParams[]);
};

export default legendGetter;
