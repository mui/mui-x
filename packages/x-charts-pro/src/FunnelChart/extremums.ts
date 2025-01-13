import { CartesianExtremumGetter } from '@mui/x-charts/internals';

const getValueExtremum =
  (direction: 'x' | 'y'): CartesianExtremumGetter<'funnel'> =>
  (params) => {
    const { series, axis, isDefaultAxis } = params;

    return Object.keys(series)
      .filter((seriesId) => {
        const yAxisId = series[seriesId].yAxisId;
        return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
      })
      .reduce(
        (acc, seriesId) => {
          const { stackedData } = series[seriesId];
          const [seriesMin, seriesMax] = stackedData
            .map((v) => v.map((t) => t[direction]))
            ?.reduce(
              (seriesAcc, values) => {
                return [Math.min(...values, seriesAcc[0]), Math.max(...values, seriesAcc[1])];
              },
              [Infinity, -Infinity],
            ) ?? [Infinity, -Infinity];

          return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
        },
        [Infinity, -Infinity],
      );
  };

export const getExtremumX: CartesianExtremumGetter<'funnel'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    const [min, max] = getValueExtremum('x')(params);
    return [max, min];
  }
  return getValueExtremum('x')(params);
};

export const getExtremumY: CartesianExtremumGetter<'funnel'> = (params) => {
  return getValueExtremum('y')(params);
};
