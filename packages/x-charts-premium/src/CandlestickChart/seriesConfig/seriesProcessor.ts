import { type SeriesId } from '@mui/x-charts/models';
import { type SeriesProcessor } from '@mui/x-charts/internals';
import { type DefaultizedOHLCSeriesType, type OHLCSeriesType } from '../../models';

const candlestickValueFormatter: NonNullable<OHLCSeriesType['valueFormatter']> = (v) =>
  v == null ? '' : v.toLocaleString();

const seriesProcessor: SeriesProcessor<'ohlc'> = (params) => {
  const { seriesOrder, series } = params;

  const completedSeries: Record<SeriesId, DefaultizedOHLCSeriesType> = {};

  for (const id of seriesOrder) {
    const seriesData = series[id];

    if (process.env.NODE_ENV !== 'production') {
      if (seriesData.data === undefined) {
        throw new Error(
          `MUI X Charts: OHLC series with id='${id}' has no data. \n` +
            'Provide a data property to the series.',
        );
      }
    }

    completedSeries[id] = {
      ...series[id],
      valueFormatter: series[id].valueFormatter ?? candlestickValueFormatter,
      data: series[id].data!,
    } satisfies DefaultizedOHLCSeriesType;
  }

  return {
    seriesOrder,
    series: completedSeries,
  };
};

export default seriesProcessor;
