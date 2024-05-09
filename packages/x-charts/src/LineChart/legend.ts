import { LegendGetter, LegendParams } from '../models/seriesType/config';

const legendGetter: LegendGetter<'line'> = (params) => {
  const { seriesOrder, series } = params;
  const data = seriesOrder.map((seriesId) => ({
    color: series[seriesId].color,
    label: series[seriesId].label,
    id: seriesId,
  }));
  return data.filter((item) => item.label !== undefined) as LegendParams[];
};

export default legendGetter;
