import { warnOnce } from '@mui/x-internals/warning';
import { type SeriesId } from '@mui/x-charts/models';
import { type SeriesProcessor } from '@mui/x-charts/internals';
import { type DefaultizedRangeBarSeriesType, type RangeBarValueType } from '../../../models';

const rangeBarValueFormatter = (v: RangeBarValueType | null) =>
  v == null ? '' : `[${v[0]}, ${v[1]}]`;

const seriesProcessor: SeriesProcessor<'rangeBar'> = (params, dataset, isItemVisible) => {
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
        `MUI X Charts: range bar series with id='${id}' has no data.
Either provide a data property to the series or use the dataset prop.`,
      );
    }

    const missingKeys = (['start', 'end'] as const).filter(
      (key) => typeof datasetKeys?.[key] !== 'string',
    );

    if (datasetKeys && missingKeys.length > 0) {
      throw new Error(
        `MUI X Charts: range bar series with id='${id}' has incomplete datasetKeys.
Properties ${missingKeys.map((key) => `"${key}"`).join(', ')} are missing.`,
      );
    }

    let data: DefaultizedRangeBarSeriesType['data'];
    if (seriesData.valueGetter) {
      data = dataset!.map((d) => seriesData.valueGetter!(d));
    } else if (datasetKeys) {
      data = dataset!.map((d) => {
        const start = d[datasetKeys.start];
        const end = d[datasetKeys.end];

        if (typeof start !== 'number' || typeof end !== 'number') {
          if (process.env.NODE_ENV !== 'production') {
            if (start !== null) {
              warnOnce([
                `MUI X Charts: Your dataset key "start" is used for plotting a range bar, but contains non-numerical elements.`,
                'Range bars only support numbers.',
              ]);
            }

            if (end !== null) {
              warnOnce([
                `MUI X Charts: Your dataset key "end" is used for plotting a range bar, but contains non-numerical elements.`,
                'Range bars only support numbers.',
              ]);
            }
          }
          return null;
        }

        return [start, end];
      });
    } else {
      data = series[id].data!;
    }

    completedSeries[id] = {
      layout: 'vertical',
      ...series[id],
      valueFormatter: series[id].valueFormatter ?? rangeBarValueFormatter,
      data,
      hidden: !isItemVisible?.({ type: 'rangeBar', seriesId: id }),
    } satisfies DefaultizedRangeBarSeriesType;
  }

  return {
    seriesOrder,
    series: completedSeries,
  };
};

export default seriesProcessor;
