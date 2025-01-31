import { CartesianExtremumGetter } from '@mui/x-charts/internals';

const getValueExtremum = (
  direction: 'x' | 'y',
  isHorizontal: boolean,
  params: Parameters<CartesianExtremumGetter<'funnel'>>[0],
): ReturnType<CartesianExtremumGetter<'funnel'>> => {
  const { series, axis, isDefaultAxis } = params;

  return (
    Object.keys(series)
      // Keep only series that are associated with the current axis
      .reduce(
        (acc, seriesId) => {
          const yAxisId = series[seriesId].yAxisId;
          const xAxisId = series[seriesId].xAxisId;
          const { dataPoints } = series[seriesId];

          if (
            yAxisId !== axis.id &&
            xAxisId !== axis.id &&
            isDefaultAxis &&
            yAxisId !== undefined &&
            xAxisId !== undefined
          ) {
            return acc;
          }

          if (
            axis.scaleType === 'band' ||
            (!isHorizontal && direction === 'x') ||
            (isHorizontal && direction === 'y')
          ) {
            const [seriesMin, seriesMax] = dataPoints
              .map((v) => v.map((t) => t[direction]))
              ?.reduce(
                (seriesAcc, values) => {
                  return [Math.min(...values, seriesAcc[0]), Math.max(...values, seriesAcc[1])];
                },
                [Infinity, -Infinity],
              ) ?? [Infinity, -Infinity];

            return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
          }

          const seriesMin = dataPoints
            .flatMap((v) =>
              v.map((t) => t[direction]).reduce((min, value) => Math.min(value, min), Infinity),
            )
            .reduce((sumAcc, value) => sumAcc + value, 0);
          const seriesMax = dataPoints
            .flatMap((v) =>
              v.map((t) => t[direction]).reduce((max, value) => Math.max(value, max), -Infinity),
            )
            .reduce((sumAcc, value) => sumAcc + value, 0);

          return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
        },
        [Infinity, -Infinity],
      )
  );
};

export const getExtremumX: CartesianExtremumGetter<'funnel'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    const [min, max] = getValueExtremum('x', isHorizontal, params);
    return [max, min];
  }
  return getValueExtremum('x', isHorizontal, params);
};

export const getExtremumY: CartesianExtremumGetter<'funnel'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  return getValueExtremum('y', isHorizontal, params);
};
