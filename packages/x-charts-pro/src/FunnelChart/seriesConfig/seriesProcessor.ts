import { DatasetType, SeriesProcessor, ChartSeriesDefaultized } from '@mui/x-charts/internals';

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

const seriesProcessor: SeriesProcessor<'funnel'> = (params, dataset) => {
  const { seriesOrder, series } = params;

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

  const isHorizontal = seriesOrder.some((seriesId) => series[seriesId].layout === 'horizontal');

  seriesOrder.forEach((seriesId) => {
    const currentSeries = series[seriesId];

    completedSeries[seriesId] = {
      labelMarkType: 'square',
      layout: isHorizontal ? 'horizontal' : 'vertical',
      valueFormatter: (item) => (item == null ? '' : item.value.toLocaleString()),
      ...currentSeries,
      data: currentSeries.data!.map((v, i) => ({
        id: `${seriesId}-funnel-item-${v.id ?? i}`,
        ...v,
      })),
      dataPoints: [],
    };

    const stackOffsets = completedSeries[seriesId].data
      .toReversed()
      .map((_, i, array) => array.slice(0, i).reduce((acc, item) => acc + item.value, 0))
      .toReversed();

    completedSeries[seriesId].dataPoints = completedSeries[seriesId].data.map(
      (item, dataIndex, array) => {
        const currentMaxMain = item.value ?? 0;
        const nextDataIndex = dataIndex === array.length - 1 ? dataIndex : dataIndex + 1;
        const nextMaxMain = array[nextDataIndex].value ?? 0;
        const nextMaxOther = 0;
        const currentMaxOther = completedSeries[seriesId].data[dataIndex].value;
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
          // Top left (vertical) or Bottom left (horizontal)
          createPoint({
            main: -currentMaxMain,
            other: currentMaxOther,
            inverse: isHorizontal,
            useBandWidth: false,
            stackOffset,
          }),
        ];
      },
    );
  });

  return {
    seriesOrder,
    series: completedSeries,
  };
};

export default seriesProcessor;
