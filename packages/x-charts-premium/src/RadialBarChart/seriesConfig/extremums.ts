import { findMinMax, type PolarExtremumGetter } from '@mui/x-charts/internals';

const getValueExtremum =
  (direction: 'rotation' | 'radius'): PolarExtremumGetter<'radialBar'> =>
  (params) => {
    const { series, axis, isDefaultAxis } = params;

    return Object.keys(series)
      .filter((seriesId) => {
        const axisId =
          direction === 'rotation'
            ? series[seriesId].rotationAxisId
            : series[seriesId].radiusAxisId;
        return axisId === axis.id || (isDefaultAxis && axisId === undefined);
      })
      .reduce(
        (acc, seriesId) => {
          const { stackedData } = series[seriesId];

          const [seriesMin, seriesMax] = stackedData?.reduce(
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

export const rotationExtremumGetter: PolarExtremumGetter<'radialBar'> = (params) => {
  // Notice that bar should be all horizontal or all vertical.

  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    return getValueExtremum('rotation')(params);
  }
  return findMinMax(params.axis.data ?? []);
};

export const radiusExtremumGetter: PolarExtremumGetter<'radialBar'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    return findMinMax(params.axis.data ?? []);
  }
  return getValueExtremum('radius')(params);
};
