import { type SeriesId } from '@mui/x-charts/models';
import { type SeriesProcessor } from '@mui/x-charts/internals';
import { type DefaultizedOHLCSeriesType, type OHLCValueType } from '../../models';

const candlestickValueFormatter = (v: OHLCValueType | null) =>
  v == null ? '' : `[${v[0]}, ${v[1]}, ${v[2]}, ${v[3]}]`;

const seriesProcessor: SeriesProcessor<'ohlc'> = (params) => {
  const { seriesOrder, series } = params;

  const completedSeries: Record<SeriesId, DefaultizedOHLCSeriesType> = {};

  for (const id of seriesOrder) {
    const seriesData = series[id];

    if (seriesData.data === undefined && process.env.NODE_ENV !== 'production') {
      throw new Error(
        [
          `MUI X Charts: OHLC series with id='${id}' has no data.`,
          'Provide a data property to the series.',
        ].join('\n'),
      );
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
