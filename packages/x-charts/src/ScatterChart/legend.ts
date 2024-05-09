import { LegendGetter, LegendParams } from '../models/seriesType/config';

const legendGetter: LegendGetter<'scatter'> = (params) => {
  const { seriesOrder, series } = params;
  const data = seriesOrder.map((seriesId) => {
    const label = series[seriesId].label;
    const labelFormatter = series[seriesId].labelFormatter;
    return {
      color: series[seriesId].color,
      label: label ? labelFormatter?.(label, { location: 'legend' }) ?? label : undefined,
      id: seriesId,
    };
  });
  return data.filter((item) => item.label !== undefined) as LegendParams[];
};

export default legendGetter;
