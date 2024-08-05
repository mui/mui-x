import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import { getStackingGroups } from '../internals/stackSeries';
import { ChartSeries, DatasetElementType, DatasetType } from '../models/seriesType/config';
import { defaultizeValueFormatter } from '../internals/defaultizeValueFormatter';
import { DefaultizedProps } from '../models/helpers';
import { SeriesId } from '../models/seriesType/common';
import { SeriesFormatter } from '../context/PluginProvider/SeriesFormatter.types';

let warnedOnce = false;

// For now it's a copy past of bar charts formatter, but maybe will diverge later
const formatter: SeriesFormatter<'line'> = (params, dataset) => {
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
          `MUI X: line series with id='${id}' has no data.`,
          'Either provide a data property to the series or use the dataset prop.',
        ].join('\n'),
      );
    }
  });

  const completedSeries: Record<SeriesId, DefaultizedProps<ChartSeries<'line'>, 'data'>> = {};

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
        ...series[id],
        data: dataKey
          ? dataset!.map((data) => {
              const value = data[dataKey];
              if (typeof value !== 'number') {
                if (process.env.NODE_ENV !== 'production' && !warnedOnce && value !== null) {
                  warnedOnce = true;
                  console.error([
                    `MUI X: Your dataset key "${dataKey}" is used for plotting line, but contains nonnumerical elements.`,
                    'Line plots only support numbers and null values.',
                  ]);
                }
                return null;
              }
              return value;
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

export default formatter;
