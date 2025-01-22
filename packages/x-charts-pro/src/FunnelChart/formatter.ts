import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import {
  DatasetType,
  SeriesProcessor,
  DatasetElementType,
  SeriesId,
  getStackingGroups,
  ChartSeriesDefaultized,
} from '@mui/x-charts/internals';
import { warnOnce } from '@mui/x-internals/warning';

type FunnelDataset = DatasetType<number>;

const createPoint = ({
  main,
  other,
  inverse,
  useBandWidth,
  stackOffset,
}: {
  main: number;
  other: number;
  inverse: boolean;
  useBandWidth: boolean;
  stackOffset: number;
}) =>
  inverse
    ? { x: other, y: main, useBandWidth, stackOffset }
    : { x: main, y: other, useBandWidth, stackOffset };

const formatter: SeriesProcessor<'funnel'> = (params, dataset) => {
  const { seriesOrder, series } = params;
  const stackingGroups = getStackingGroups({
    ...params,
  });

  // Create a data set with format adapted to d3
  const d3Dataset: FunnelDataset = (dataset as FunnelDataset) ?? [];
  seriesOrder.forEach((id) => {
    const data = series[id].data;
    if (data !== undefined) {
      data.forEach((item, index) => {
        if (d3Dataset.length <= index) {
          d3Dataset.push({ [id]: item.value });
        } else {
          d3Dataset[index][id] = item.value;
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

  const completedSeries: Record<string, ChartSeriesDefaultized<'funnel'>> = {};

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
        labelMarkType: 'square',
        layout: isHorizontal ? 'horizontal' : 'vertical',
        valueFormatter: (item) => (item == null ? '' : item.value.toLocaleString()),
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
                return { value: 0 };
              }
              return { value };
            })
          : series[id].data!,
        stackedData: [],
      };
    });

    ids.forEach((id, index) => {
      const stackOffsets = completedSeries[id].data
        .toReversed()
        .map((_, i, array) => array.slice(0, i).reduce((acc, item) => acc + item.value, 0))
        .toReversed();

      completedSeries[id].stackedData = completedSeries[id].data.map((item, dataIndex, array) => {
        const currentMaxMain = item.value ?? 0;
        const nextDataIndex = dataIndex === array.length - 1 ? dataIndex : dataIndex + 1;
        const nextMaxMain = array[nextDataIndex].value ?? 0;
        const [nextMaxOther, currentMaxOther] = stackedSeries[index][dataIndex];
        const stackOffset = stackOffsets[dataIndex];

        return [
          // Top right (vertical) or Top left (horizontal)
          createPoint({
            main: currentMaxMain,
            other: currentMaxOther,
            inverse: isHorizontal,
            useBandWidth: false,
            stackOffset,
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
            stackOffset,
          }),
          // Bottom left (vertical) or Bottom right (horizontal)
          createPoint({
            main: -nextMaxMain,
            other: nextMaxOther,
            inverse: isHorizontal,
            useBandWidth: true,
            stackOffset,
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
            stackOffset,
          }),
        ];
        // TODO: fix type
      }) as any;
    });
  });

  return {
    seriesOrder,
    stackingGroups,
    series: completedSeries,
  };
};

export default formatter;
