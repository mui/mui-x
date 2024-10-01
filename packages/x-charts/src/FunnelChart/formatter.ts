import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import { warnOnce } from '@mui/x-internals/warning';
import { getStackingGroups } from '../internals/stackSeries';
import { ChartSeries, DatasetElementType, DatasetType } from '../models/seriesType/config';
import { defaultizeValueFormatter } from '../internals/defaultizeValueFormatter';
import { DefaultizedProps } from '../models/helpers';
import { SeriesId } from '../models/seriesType/common';
import { SeriesFormatter } from '../context/PluginProvider/SeriesFormatter.types';

type FunnelDataset = DatasetType<number | null>;

const formatter: SeriesFormatter<'funnel'> = (params, dataset) => {
  const { seriesOrder, series } = params;
  const stackingGroups = getStackingGroups(
    {
      ...params,
      defaultStrategy: {
        stackOrder: 'ascending',
        stackOffset: 'none',
      },
    },
    'funnel',
  );

  // Create a data set with format adapted to d3
  const d3Dataset: FunnelDataset = (dataset as FunnelDataset) ?? [];
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
    } else if (dataset === undefined) {
      throw new Error(
        [
          `MUI X: funnel series with id='${id}' has no data.`,
          'Either provide a data property to the series or use the dataset prop.',
        ].join('\n'),
      );
    }
  });

  const completedSeries: {
    [id: string]: DefaultizedProps<ChartSeries<'funnel'>, 'data' | 'layout'>;
  } = {};

  stackingGroups.forEach((stackingGroup) => {
    const { ids, stackingOffset, stackingOrder } = stackingGroup;
    // Get stacked values, and derive the domain
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

    ids.forEach((id) => {
      const dataKey = series[id].dataKey;
      completedSeries[id] = {
        layout: 'vertical',
        ...series[id],
        data: dataKey
          ? dataset!.map((data) => {
              const value = data[dataKey];
              if (typeof value !== 'number') {
                if (process.env.NODE_ENV !== 'production') {
                  warnOnce([
                    `MUI X: your dataset key "${dataKey}" is used for plotting funnels, but contains nonnumerical elements.`,
                    'Funnel plots only support number values.',
                  ]);
                }
                return 0;
              }
              return value;
            })
          : series[id].data!,
        stackedDataMain: [],
        stackedDataOther: [],
      };
    });

    const allValues = ids
      .flatMap((id) => completedSeries[id].data.flat(Infinity))
      .filter((v): v is number => v != null);

    // max=120 min=20 sum=190
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    const sum = ids
      .flatMap((id) => completedSeries[id].data.flat(Infinity))
      .reduce((acc, value) => (acc ?? 0) + (value ?? 0), 0);

    let summed = 0;
    ids.forEach((id, index) => {
      completedSeries[id].stackedDataMain = completedSeries[id].data.map((value, dataIndex) => {
        const currentMax = value ?? 0;
        const nextId = ids[index + 1];
        const prevId = ids[index - 1];
        const nextMax = completedSeries[nextId]?.data[dataIndex] ?? 0;
        const prevMax = completedSeries[prevId]?.data[dataIndex] ?? 0;

        summed = nextMax + summed;
        console.log({ currentMax, nextMax, prevMax, summed });
        return {
          v0: min + (prevMax ? currentMax / 2 : 0),
          v1: (prevMax ? min + currentMax / 2 : 0) + currentMax,
          v2: (prevMax ? min + currentMax / 2 : 0) + currentMax - nextMax / 2,
          v3: min + nextMax / 2 + (prevMax ? currentMax / 2 : 0),
        };
      });

      completedSeries[id].stackedDataOther = stackedSeries[index].map(([nextMax, currentMax]) => ({
        v0: currentMax,
        v1: currentMax,
        v2: nextMax,
        v3: nextMax,
      }));
    });
  });

  return {
    seriesOrder,
    stackingGroups,
    series: defaultizeValueFormatter(completedSeries, (v) => (v == null ? '' : v.toLocaleString())),
  };
};

export default formatter;
