import { warnOnce } from '@mui/x-internals/warning';
import { type SeriesId } from '@mui/x-charts/models';
import { type SeriesProcessor } from '@mui/x-charts/internals';
import { type DefaultizedOHLCSeriesType, type OHLCValueType } from '../../models';

const candlestickValueFormatter = (v: OHLCValueType | null) =>
  v == null ? '' : `[${v[0]}, ${v[1]}, ${v[2]}, ${v[3]}]`;

const seriesProcessor: SeriesProcessor<'ohlc'> = (params, dataset) => {
  const { seriesOrder, series } = params;

  const completedSeries: Record<SeriesId, DefaultizedOHLCSeriesType> = {};

  for (const id of seriesOrder) {
    const seriesData = series[id];
    const datasetKeys = seriesData?.datasetKeys;

    if (
      seriesData.data === undefined &&
      dataset === undefined &&
      process.env.NODE_ENV !== 'production'
    ) {
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

    completedSeries[id] = {
      ...series[id],
      valueFormatter: series[id].valueFormatter ?? candlestickValueFormatter,
      data: datasetKeys
        ? dataset!.map((data) => {
            const open = data[datasetKeys.open];
            const high = data[datasetKeys.high];
            const low = data[datasetKeys.low];
            const close = data[datasetKeys.close];

            if (
              typeof open !== 'number' ||
              typeof high !== 'number' ||
              typeof low !== 'number' ||
              typeof close !== 'number'
            ) {
              if (process.env.NODE_ENV !== 'production') {
                for (const key of ['open', 'high', 'low', 'close'] as const) {
                  if (
                    data[datasetKeys[key]] !== null &&
                    typeof data[datasetKeys[key]] !== 'number'
                  ) {
                    warnOnce([
                      `MUI X Charts: Your dataset key "${key}" is used for plotting a candlestick, but contains nonnumerical elements.`,
                      'Candlestick charts only support numbers.',
                    ]);
                  }
                }
              }
              return null;
            }

            return [open, high, low, close];
          })
        : series[id].data!,
    } satisfies DefaultizedOHLCSeriesType;
  }

  return {
    seriesOrder,
    series: completedSeries,
  };
};

export default seriesProcessor;
