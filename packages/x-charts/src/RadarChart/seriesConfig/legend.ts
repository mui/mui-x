import { LegendItemParams } from '../../ChartsLegend/legendContext.types';
import { getLabel } from '../../internals/getLabel';
import { LegendGetter } from '../../internals/plugins/models/seriesConfig';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

const legendGetter: LegendGetter<'radar'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');

    if (formattedLabel === undefined) {
      return acc;
    }

    acc.push({
      id: seriesId,
      seriesId,
      color: getSeriesColorFn(series[seriesId].color)(null),
      label: formattedLabel,
      markType: series[seriesId].labelMarkType ?? 'square',
    });
    return acc;
  }, [] as LegendItemParams[]);
};

export default legendGetter;
