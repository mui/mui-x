import { warnOnce } from '@mui/x-internals/warning';
import { type SeriesId } from '@mui/x-charts/models';
import { type SeriesProcessor } from '@mui/x-charts/internals';
import { type DefaultizedRangeBarSeriesType, type RangeBarValueType } from '../../../models';

const rangeBarValueFormatter = (v: RangeBarValueType | null) =>
  v == null ? '' : `[${v[0]}, ${v[1]}]`;

const seriesProcessor: SeriesProcessor<'rangeBar'> = (params, dataset) => {
  const { seriesOrder, series } = params;

  const completedSeries: Record<SeriesId, DefaultizedRangeBarSeriesType> = {};

  for (const id of seriesOrder) {
    const seriesData = series[id];
    const datasetKeys = seriesData?.datasetKeys;

    if (
      seriesData.data === undefined &&
      dataset === undefined &&
      process.env.NODE_ENV !== 'production'
    ) {
      throw new Error(
        [
          `MUI X Charts: range bar series with id='${id}' has no data.`,
          'Either provide a data property to the series or use the dataset prop.',
        ].join('\n'),
      );
    }

    const missingKeys = (['start', 'end'] as const).filter(
      (key) => typeof datasetKeys?.[key] !== 'string',
    );

    if (datasetKeys && missingKeys.length > 0) {
      throw new Error(
        [
          `MUI X Charts: range bar series with id='${id}' has incomplete datasetKeys.`,
          `Properties ${missingKeys.map((key) => `"${key}"`).join(', ')} are missing.`,
        ].join('\n'),
      );
    }

    completedSeries[id] = {
      layout: 'vertical',
      ...series[id],
      valueFormatter: series[id].valueFormatter ?? rangeBarValueFormatter,
      data: datasetKeys
        ? dataset!.map((data) => {
            const start = data[datasetKeys.start];
            const end = data[datasetKeys.end];

            if (typeof start !== 'number' || typeof end !== 'number') {
              if (process.env.NODE_ENV !== 'production') {
                if (start !== null) {
                  warnOnce([
                    `MUI X Charts: Your dataset key "start" is used for plotting an range bar, but contains nonnumerical elements.`,
                    'Range bars only support numbers.',
                  ]);
                }

                if (end !== null) {
                  warnOnce([
                    `MUI X Charts: Your dataset key "end" is used for plotting an range bar, but contains nonnumerical elements.`,
                    'Range bars only support numbers.',
                  ]);
                }
              }
              return null;
            }

            return [start, end];
          })
        : series[id].data!,
    } satisfies DefaultizedRangeBarSeriesType;
  }

  return {
    seriesOrder,
    series: completedSeries,
  };
};

export default seriesProcessor;
