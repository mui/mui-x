import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import { warnOnce } from '@mui/x-internals/warning';
import { getStackingGroups } from '../internals/stackSeries';
import { ChartSeries, DatasetElementType, DatasetType } from '../models/seriesType/config';
import { defaultizeValueFormatter } from '../internals/defaultizeValueFormatter';
import { DefaultizedProps } from '../models/helpers';
import { SeriesId } from '../models/seriesType/common';
import { SeriesFormatter } from '../context/PluginProvider/SeriesFormatter.types';

type FunnelDataset = DatasetType<number | null>;

const createPoint = ({
  main,
  other,
  inverse,
  useBandWidth,
}: {
  main: number;
  other: number;
  inverse: boolean;
  useBandWidth: boolean;
}) => (inverse ? { x: other, y: main, useBandWidth } : { x: main, y: other, useBandWidth });

const formatter: SeriesFormatter<'funnel'> = (params, dataset) => {
  const { seriesOrder, series } = params;
  const stackingGroups = getStackingGroups(
    {
      ...params,
      defaultStrategy: {
        stackOrder: 'reverse',
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

    const isHorizontal = ids.some((id) => series[id].layout === 'horizontal');

    ids.forEach((id) => {
      const dataKey = series[id].dataKey;
      completedSeries[id] = {
        layout: isHorizontal ? 'horizontal' : 'vertical',
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
        stackedData: [],
      };
    });

    ids.forEach((id, index) => {
      completedSeries[id].stackedData = completedSeries[id].data.map((value, dataIndex) => {
        const currentMaxMain = value ?? 0;
        const nextId = ids[index === ids.length - 1 ? index : index + 1];
        const nextMaxMain = completedSeries[nextId].data[dataIndex] ?? 0;
        const [nextMaxOther, currentMaxOther] = stackedSeries[index][dataIndex];

        return [
          // Top right (vertical) or Top left (horizontal)
          createPoint({
            main: currentMaxMain,
            other: currentMaxOther,
            inverse: isHorizontal,
            useBandWidth: false,
          }),
          // Middle right
          // {
          //   x: currentMaxMain - (currentMaxMain - nextMaxMain) * 0,
          //   y: currentMaxOther - (currentMaxOther - nextMaxOther) * 0.1,
          // },
          // {
          //   x: currentMaxMain - (currentMaxMain - nextMaxMain) * 1,
          //   y: currentMaxOther - (currentMaxOther - nextMaxOther) * 0.9,
          // },
          // Bottom right (vertical) or Top right (horizontal)
          createPoint({
            main: nextMaxMain,
            other: nextMaxOther,
            inverse: isHorizontal,
            useBandWidth: true,
          }),
          // Bottom left (vertical) or Bottom right (horizontal)
          createPoint({
            main: -nextMaxMain,
            other: nextMaxOther,
            inverse: isHorizontal,
            useBandWidth: true,
          }),
          // Middle left
          // {
          //   x: -nextMaxMain - (currentMaxMain - nextMaxMain) * 0,
          //   y: currentMaxOther - (currentMaxOther - nextMaxOther) * 0.9,
          // },
          // {
          //   x: -nextMaxMain - (currentMaxMain - nextMaxMain) * 1,
          //   y: currentMaxOther - (currentMaxOther - nextMaxOther) * 0.1,
          // },
          // Top left (vertical) or Bottom left (horizontal)
          createPoint({
            main: -currentMaxMain,
            other: currentMaxOther,
            inverse: isHorizontal,
            useBandWidth: false,
          }),
        ];
      });
    });
  });

  return {
    seriesOrder,
    stackingGroups,
    series: defaultizeValueFormatter(completedSeries, (v) => (v == null ? '' : v.toLocaleString())),
  };
};

export default formatter;
