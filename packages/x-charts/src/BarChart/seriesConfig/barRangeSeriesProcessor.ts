import { warnOnce } from '@mui/x-internals/warning';
import { DefaultizedProps } from '@mui/x-internals/types';
import { ChartSeries } from '../../models/seriesType/config';
import { SeriesId } from '../../models/seriesType/common';
import { SeriesProcessor } from '../../internals/plugins/models';
import { defaultizeValueFormatter } from '../../internals/defaultizeValueFormatter';

const seriesProcessor: SeriesProcessor<'barRange'> = (params, dataset) => {
  const { seriesOrder, series } = params;

  const completedSeries: Record<SeriesId, DefaultizedProps<ChartSeries<'barRange'>, 'data'>> = {};

  for (const id of seriesOrder) {
    const seriesData = series[id];
    const datasetKeys = seriesData?.datasetKeys;

    if (
      seriesData.data === undefined &&
      seriesData.dataset === undefined &&
      process.env.NODE_ENV !== 'production'
    ) {
      throw new Error(
        [
          `MUI X Charts: bar range series with id='${id}' has no data.`,
          'Either provide a data property to the series or use the dataset prop.',
        ].join('\n'),
      );
    }

    const missingKeys = (['start', 'end'] as const).filter(
      (key) => typeof datasetKeys?.[key] !== 'string',
    );

    if (seriesData?.datasetKeys && missingKeys.length > 0) {
      throw new Error(
        [
          `MUI X Charts: scatter series with id='${id}' has incomplete datasetKeys.`,
          `Properties ${missingKeys.map((key) => `"${key}"`).join(', ')} are missing.`,
        ].join('\n'),
      );
    }

    completedSeries[id] = {
      ...series[id],
      data: datasetKeys
        ? dataset!.map((data) => {
            const start = data[datasetKeys.start];
            const end = data[datasetKeys.end];

            if (typeof start !== 'number' || typeof end !== 'number') {
              if (process.env.NODE_ENV !== 'production') {
                if (start !== null) {
                  warnOnce([
                    `MUI X Charts: Your dataset key "start" is used for plotting an bar range, but contains nonnumerical elements.`,
                    'Area plots only support numbers and null values.',
                  ]);
                }

                if (end !== null) {
                  warnOnce([
                    `MUI X Charts: Your dataset key "end" is used for plotting an bar range, but contains nonnumerical elements.`,
                    'Area plots only support numbers and null values.',
                  ]);
                }
              }
              return null;
            }

            return { start, end };
          })
        : series[id].data!,
    } satisfies DefaultizedProps<ChartSeries<'barRange'>, 'data'>;
  }

  return {
    seriesOrder,
    series: defaultizeValueFormatter(completedSeries, (v) =>
      v == null ? '' : `${v.start} - ${v.end}`,
    ),
  };
};

export default seriesProcessor;
