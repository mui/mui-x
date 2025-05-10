import { SeriesProcessor, ChartSeriesDefaultized } from '@mui/x-charts/internals';

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

const seriesProcessor: SeriesProcessor<'funnel'> = (params) => {
  const { seriesOrder, series } = params;

  const completedSeries: Record<string, ChartSeriesDefaultized<'funnel'>> = {};

  const isHorizontal = seriesOrder.some((seriesId) => series[seriesId].layout === 'horizontal');

  seriesOrder.forEach((seriesId) => {
    const currentSeries = series[seriesId];

    const firstDataPoint = currentSeries.data.at(0);
    const lastDataPoint = currentSeries.data.at(-1);
    const dataDirection =
      firstDataPoint && lastDataPoint && firstDataPoint.value < lastDataPoint.value
        ? 'increasing'
        : 'decreasing';

    completedSeries[seriesId] = {
      labelMarkType: 'square',
      layout: isHorizontal ? 'horizontal' : 'vertical',
      valueFormatter: (item) => (item == null ? '' : item.value.toLocaleString()),
      ...currentSeries,
      data: currentSeries.data!.map((v, i) => ({
        id: `${seriesId}-funnel-item-${v.id ?? i}`,
        ...v,
      })),
      dataDirection,
      dataPoints: [],
    };

    const stackOffsets = completedSeries[seriesId].data
      .toReversed()
      .map((_, i, array) => array.slice(0, i).reduce((acc, item) => acc + item.value, 0))
      .toReversed();

    completedSeries[seriesId].dataPoints = completedSeries[seriesId].data.map(
      (item, dataIndex, array) => {
        // Main = main axis, Other = other axis
        // For horizontal layout, main is y, other is x
        // For vertical layout, main is x, other is y
        const isIncreasing = completedSeries[seriesId].dataDirection === 'increasing';
        const currentMaxMain = item.value;
        const getNextDataIndex = () => {
          if (isIncreasing) {
            return dataIndex === 0 ? dataIndex : dataIndex - 1;
          }
          return dataIndex === array.length - 1 ? dataIndex : dataIndex + 1;
        };
        const nextDataIndex = getNextDataIndex();
        const nextMaxMain = array[nextDataIndex].value ?? 0;
        const nextMaxOther = 0;
        const currentMaxOther = completedSeries[seriesId].data[dataIndex].value;
        const stackOffset = stackOffsets[dataIndex];

        if (isIncreasing) {
          return [
            // Top right (vertical) or Top left (horizontal)
            createPoint({
              main: nextMaxMain,
              other: nextMaxOther,
              inverse: isHorizontal,
              useBandWidth: false,
              stackOffset,
            }),
            // Bottom right (vertical) or Top right (horizontal)
            createPoint({
              main: currentMaxMain,
              other: currentMaxOther,
              inverse: isHorizontal,
              useBandWidth: true,
              stackOffset,
            }),
            // Bottom left (vertical) or Bottom right (horizontal)
            createPoint({
              main: -currentMaxMain,
              other: currentMaxOther,
              inverse: isHorizontal,
              useBandWidth: true,
              stackOffset,
            }),
            // Top left (vertical) or Bottom left (horizontal)
            createPoint({
              main: -nextMaxMain,
              other: nextMaxOther,
              inverse: isHorizontal,
              useBandWidth: false,
              stackOffset,
            }),
          ];
        }

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
