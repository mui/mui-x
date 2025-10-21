import { warnOnce } from '@mui/x-internals/warning';
import { DefaultizedProps } from '@mui/x-internals/types';
import { ChartSeries } from '../../models/seriesType/config';
import { defaultizeValueFormatter } from '../../internals/defaultizeValueFormatter';
import { SeriesId } from '../../models/seriesType/common';
import { SeriesProcessor } from '../../internals/plugins/models';

// For now it's a copy past of bar charts formatter, but maybe will diverge later
const seriesProcessor: SeriesProcessor<'areaRange'> = (params, dataset) => {
  const { seriesOrder, series } = params;

  seriesOrder.forEach((id) => {
    const data = series[id].data;
    if (data === undefined && dataset === undefined && process.env.NODE_ENV !== 'production') {
      throw new Error(
        [
          `MUI X Charts: area series with id='${id}' has no data.`,
          'Either provide a data property to the series or use the dataset prop.',
        ].join('\n'),
      );
    }
  });

  const completedSeries: Record<SeriesId, DefaultizedProps<ChartSeries<'areaRange'>, 'data'>> = {};

  for (const id of seriesOrder) {
    const seriesData = series[id];
    const datasetKeys = seriesData?.datasetKeys;

    const missingKeys = (['start', 'end'] as const).filter(
      (key) => typeof datasetKeys?.[key] !== 'string',
    );

    if (seriesData?.datasetKeys && missingKeys.length > 0) {
      throw new Error(
        [
          `MUI X Charts: area series with id='${id}' has incomplete datasetKeys.`,
          `Properties ${missingKeys.map((key) => `"${key}"`).join(', ')} are missing.`,
        ].join('\n'),
      );
    }

    completedSeries[id] = {
      // TODO: Do we need this prop?
      labelMarkType: 'line',
      ...series[id],
      data: datasetKeys
        ? dataset!.map((data) => {
            const start = data[datasetKeys.start];
            const end = data[datasetKeys.end];

            if (typeof start !== 'number' || typeof end !== 'number') {
              if (process.env.NODE_ENV !== 'production') {
                if (start !== null) {
                  warnOnce([
                    `MUI X Charts: Your dataset key "start" is used for plotting an area range, but contains nonnumerical elements.`,
                    'Area plots only support numbers and null values.',
                  ]);
                }

                if (end !== null) {
                  warnOnce([
                    `MUI X Charts: Your dataset key "end" is used for plotting an area range, but contains nonnumerical elements.`,
                    'Area plots only support numbers and null values.',
                  ]);
                }
              }
              return null;
            }

            return { start, end };
          })
        : series[id].data!,
    };
  }

  return {
    seriesOrder,
    series: defaultizeValueFormatter(completedSeries, (v) =>
      v == null ? '' : `${v.start} - ${v.end}`,
    ),
  };
};

export default seriesProcessor;
