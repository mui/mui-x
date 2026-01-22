import { type SeriesProcessor } from '../../internals/plugins/models';
import type { DefaultizedRadarSeriesType } from '../../models';
import type { SeriesId } from '../../models/seriesType/common';

const defaultRadarValueFormatter: DefaultizedRadarSeriesType['valueFormatter'] = (v) =>
  v == null ? '' : v.toLocaleString();

const seriesProcessor: SeriesProcessor<'radar'> = (params, _, isItemVisible) => {
  const { seriesOrder, series: seriesMap } = params;

  const completedSeries: Record<SeriesId, DefaultizedRadarSeriesType> = {};

  seriesOrder.forEach((seriesId) => {
    const series = seriesMap[seriesId];
    const hidden = !isItemVisible?.({ type: 'radar', seriesId });

    completedSeries[seriesId] = {
      labelMarkType: 'square',
      ...series,
      valueFormatter: series.valueFormatter ?? defaultRadarValueFormatter,
      hidden,
    };
  });

  return {
    seriesOrder,
    series: completedSeries,
  };
};

export default seriesProcessor;
