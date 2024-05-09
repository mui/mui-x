import { LegendGetter, LegendParams } from '../models/seriesType/config';

const legendGetter: LegendGetter<'pie'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.flatMap(
    (seriesId) =>
      series[seriesId].data
        .map((item) => ({
          color: item.color,
          label: item.label,
          id: item.id,
        }))
        .filter((item) => item.label !== undefined) as LegendParams[],
  );
};

export default legendGetter;
