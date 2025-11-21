import { SeriesProcessor } from '../../internals/plugins/models/seriesConfig';
import type { DefaultizedRadarSeriesType } from '../../models';
import type { SeriesId } from '../../models/seriesType/common';

const radarValueFormatter = ((v) =>
  v == null ? '' : v.toLocaleString()) as DefaultizedRadarSeriesType['valueFormatter'];

const seriesProcessor: SeriesProcessor<'radar'> = (params, _, hiddenIdentifiers) => {
  const { seriesOrder, series: seriesMap } = params;

  const hiddenIds = new Set(hiddenIdentifiers?.map((v) => v.seriesId));

  const completedSeries: Record<SeriesId, DefaultizedRadarSeriesType> = {};

  seriesOrder.forEach((seriesId) => {
    const series = seriesMap[seriesId];
    const hidden = hiddenIds.has(seriesId);

    completedSeries[seriesId] = {
      labelMarkType: 'line',
      valueFormatter: radarValueFormatter,
      ...series,
      hidden,
    };
  });

  return {
    seriesOrder,
    series: completedSeries,
  };
};

export default seriesProcessor;
