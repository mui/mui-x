import { warnOnce } from '@mui/x-internals/warning';
import { type SeriesId } from '@mui/x-charts/models';
import { type SeriesProcessor } from '@mui/x-charts/internals';
import { type DefaultizedOHLCSeriesType } from '../../models';

const candlestickValueFormatter: DefaultizedOHLCSeriesType['valueFormatter'] = (v) =>
  v == null ? '' : v.toLocaleString();

const seriesProcessor: SeriesProcessor<'ohlc'> = (params, dataset, isItemVisible) => {
  const { seriesOrder, series } = params;

  const completedSeries: Record<SeriesId, DefaultizedOHLCSeriesType> = {};

  for (const id of seriesOrder) {
    const seriesData = series[id];
    const datasetKeys = seriesData?.datasetKeys;

    if (seriesData.data === undefined && dataset === undefined) {
      throw new Error(
        `MUI X Charts: OHLC series with id='${id}' has no data.
Either provide a data property to the series or use the dataset prop.`,
      );
    }

    const missingKeys = (['open', 'high', 'low', 'close'] as const).filter(
      (key) => typeof datasetKeys?.[key] !== 'string',
    );

    if (datasetKeys && missingKeys.length > 0) {
      throw new Error(
        `MUI X Charts: OHLC series with id='${id}' has incomplete datasetKeys.
Properties ${missingKeys.map((key) => `"${key}"`).join(', ')} are missing.`,
      );
    }

    let data: DefaultizedOHLCSeriesType['data'];
    if (seriesData.valueGetter) {
      data = dataset!.map((d) => seriesData.valueGetter!(d));
    } else if (datasetKeys) {
      data = dataset!.map((d) => {
        const open = d[datasetKeys.open];
        const high = d[datasetKeys.high];
        const low = d[datasetKeys.low];
        const close = d[datasetKeys.close];

        if (
          typeof open !== 'number' ||
          typeof high !== 'number' ||
          typeof low !== 'number' ||
          typeof close !== 'number'
        ) {
          if (process.env.NODE_ENV !== 'production') {
            for (const key of ['open', 'high', 'low', 'close'] as const) {
              if (d[datasetKeys[key]] !== null && typeof d[datasetKeys[key]] !== 'number') {
                warnOnce([
                  `MUI X Charts: Your dataset key "${key}" is used for plotting a candlestick, but contains non-numerical elements.`,
                  'Candlestick charts only support numbers.',
                ]);
              }
            }
          }
          return null;
        }

        return [open, high, low, close];
      });
    } else {
      data = series[id].data!;
    }

    completedSeries[id] = {
      ...series[id],
      valueFormatter: series[id].valueFormatter ?? candlestickValueFormatter,
      hidden: !isItemVisible?.({ type: 'ohlc', seriesId: id }),
      data,
    } satisfies DefaultizedOHLCSeriesType;
  }

  return {
    seriesOrder,
    series: completedSeries,
  };
};

export default seriesProcessor;
