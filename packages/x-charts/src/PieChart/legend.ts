import { getLabel } from '../internals/getLabel';
import { LegendGetter, LegendParams } from '../models/seriesType/config';

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
      });
    });
    return acc;
  }, [] as LegendParams[]);
};

export default legendGetter;
