import { type SeriesProcessor, type ChartSeriesDefaultized } from '@mui/x-charts/internals';
import type { FunnelCurveType } from '../curves';

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

const getFunnelDirection = (
  funnelDirection: 'increasing' | 'decreasing' | 'auto' | undefined,
  curve: FunnelCurveType | undefined,
  firstValue: number | undefined | null,
  lastValue: number | undefined | null,
): 'increasing' | 'decreasing' => {
  if (
    curve !== 'step' &&
    curve !== 'linear-sharp' &&
    (funnelDirection === 'increasing' || funnelDirection === 'decreasing')
  ) {
    return funnelDirection;
  }

  // Implicit check for null or undefined values
  return firstValue != null && lastValue != null && firstValue < lastValue
    ? 'increasing'
    : 'decreasing';
};

const seriesProcessor: SeriesProcessor<'funnel'> = (params) => {
  const { seriesOrder, series } = params;

  const completedSeries: Record<string, ChartSeriesDefaultized<'funnel'>> = {};

  const isHorizontal = seriesOrder.some((seriesId) => series[seriesId].layout === 'horizontal');

  seriesOrder.forEach((seriesId) => {
    const currentSeries = series[seriesId];

    const firstDataPoint = currentSeries.data.at(0);
    const lastDataPoint = currentSeries.data.at(-1);
    const funnelDirection = getFunnelDirection(
      currentSeries.funnelDirection,
      currentSeries.curve,
      firstDataPoint?.value,
      lastDataPoint?.value,
    );

    completedSeries[seriesId] = {
      labelMarkType: 'square',
      layout: isHorizontal ? 'horizontal' : 'vertical',
      valueFormatter: (item) => (item == null ? '' : item.value.toLocaleString()),
      ...currentSeries,
      data: currentSeries.data!.map((v, i) => ({
        id: `${seriesId}-funnel-item-${v.id ?? i}`,
        ...v,
      })),
      funnelDirection,
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
        const isIncreasing = completedSeries[seriesId].funnelDirection === 'increasing';

        let currentMaxMain = 0;
        let nextMaxMain = 0;
        let nextDataIndex = 0;

        if (isIncreasing) {
          nextDataIndex = dataIndex === 0 ? dataIndex : dataIndex - 1;
          currentMaxMain = array[nextDataIndex].value ?? 0;
          nextMaxMain = item.value;
        } else {
          nextDataIndex = dataIndex === array.length - 1 ? dataIndex : dataIndex + 1;
          currentMaxMain = item.value;
          nextMaxMain = array[nextDataIndex].value ?? 0;
        }
        const stackOffset = stackOffsets[dataIndex];
        const nextMaxOther = 0;
        const currentMaxOther = completedSeries[seriesId].data[dataIndex].value;

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
