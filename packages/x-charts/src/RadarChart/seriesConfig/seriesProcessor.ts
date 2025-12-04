import { type SeriesProcessor } from '../../internals/plugins/models/seriesConfig';
import type { DefaultizedRadarSeriesType } from '../../models';
import type { SeriesId } from '../../models/seriesType/common';

const radarValueFormatter: DefaultizedRadarSeriesType['valueFormatter'] = (v) =>
  v == null ? '' : v.toLocaleString();

const seriesProcessor: SeriesProcessor<'radar'> = (params, _) => {
  const { seriesOrder, series: seriesMap } = params;

  const completedSeries: Record<SeriesId, DefaultizedRadarSeriesType> = {};

  seriesOrder.forEach((seriesId) => {
    const series = seriesMap[seriesId];

    completedSeries[seriesId] = {
      labelMarkType: 'square',
      valueFormatter: radarValueFormatter,
      ...series,
    };
  });

  return {
    seriesOrder,
    series: completedSeries,
  };
};

export default seriesProcessor;
