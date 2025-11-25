import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import { warnOnce } from '@mui/x-internals/warning';
import { DefaultizedProps } from '@mui/x-internals/types';
import { getStackingGroups } from '../../internals/stackSeries';
import { ChartSeries, DatasetElementType, DatasetType } from '../../models/seriesType/config';
import { defaultizeValueFormatter } from '../../internals/defaultizeValueFormatter';
import { SeriesId } from '../../models/seriesType/common';
import { SeriesProcessorWithoutDimensions } from '../../internals/plugins/models';

const seriesProcessorWithoutDimensions: SeriesProcessorWithoutDimensions<'line'> = (
  params,
  dataset,
) => {
  const { seriesOrder, series } = params;
  const stackingGroups = getStackingGroups({ ...params, defaultStrategy: { stackOffset: 'none' } });

  // Create a data set with format adapted to d3
  const d3Dataset: DatasetType<number | null> = (dataset as DatasetType<number | null>) ?? [];
  seriesOrder.forEach((id) => {
    const data = series[id].data;
    if (data !== undefined) {
      data.forEach((value, index) => {
        if (d3Dataset.length <= index) {
          d3Dataset.push({ [id]: value });
        } else {
          d3Dataset[index][id] = value;
        }
      });
    } else if (dataset === undefined && process.env.NODE_ENV !== 'production') {
      throw new Error(
        [
          `MUI X Charts: line series with id='${id}' has no data.`,
          'Either provide a data property to the series or use the dataset prop.',
        ].join('\n'),
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      if (!data && dataset) {
        const dataKey = series[id].dataKey;

        if (!dataKey) {
          throw new Error(
            [
              `MUI X Charts: line series with id='${id}' has no data and no dataKey.`,
              'You must provide a dataKey when using the dataset prop.',
            ].join('\n'),
          );
        }

        dataset.forEach((entry, index) => {
          const value = entry[dataKey];
          if (value != null && typeof value !== 'number') {
            warnOnce(
              [
                `MUI X Charts: your dataset key "${dataKey}" is used for plotting lines, but the dataset contains the non-null non-numerical element "${value}" at index ${index}.`,
                'Line plots only support numeric and null values.',
              ].join('\n'),
            );
          }
        });
      }
    }
  });

  const completedSeries: Record<
    SeriesId,
    DefaultizedProps<ChartSeries<'line'>, 'data'> & { stackedData: [number, number][] }
  > = {};

  stackingGroups.forEach((stackingGroup) => {
    // Get stacked values, and derive the domain
    const { ids, stackingOrder, stackingOffset } = stackingGroup;
    const stackedSeries = d3Stack<any, DatasetElementType<number | null>, SeriesId>()
      .keys(
        ids.map((id) => {
          // Use dataKey if needed and available
          const dataKey = series[id].dataKey;
          return series[id].data === undefined && dataKey !== undefined ? dataKey : id;
        }),
      )
      .value((d, key) => d[key] ?? 0) // defaultize null value to 0
      .order(stackingOrder)
      .offset(stackingOffset)(d3Dataset);

    ids.forEach((id, index) => {
      const dataKey = series[id].dataKey;
      completedSeries[id] = {
        labelMarkType: 'line',
        ...series[id],
        data: dataKey
          ? dataset!.map((data) => {
              const value = data[dataKey];

              return typeof value === 'number' ? value : null;
            })
          : series[id].data!,
        stackedData: stackedSeries[index].map(([a, b]) => [a, b]),
      };
    });
  });

  return {
    seriesOrder,
    stackingGroups,
    series: defaultizeValueFormatter(completedSeries, (v) => (v == null ? '' : v.toLocaleString())),
  };
};

export default seriesProcessorWithoutDimensions;
