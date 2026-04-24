import { findMinMax, type PolarExtremumGetter } from '@mui/x-charts/internals';

export const rotationExtremumGetter: PolarExtremumGetter<'radialBar'> = (params) => {
  const { axis } = params;

  return findMinMax(axis.data ?? []);
};

function getSeriesExtremums(
  data: readonly (number | null)[],
  stackedData: [number, number][],
): [number, number] {
  return stackedData.reduce<[number, number]>(
    (seriesAcc, stackedValue, index) => {
      if (data[index] === null) {
        return seriesAcc;
      }
      const [base, value] = stackedValue;

      return [Math.min(base, value, seriesAcc[0]), Math.max(base, value, seriesAcc[1])];
    },
    [Infinity, -Infinity],
  );
}

export const radiusExtremumGetter: PolarExtremumGetter<'radialBar'> = (params) => {
  const { series, axis, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const radiusAxisId = series[seriesId].radiusAxisId;
      return radiusAxisId === axis.id || (isDefaultAxis && radiusAxisId === undefined);
    })
    .reduce(
      (acc, seriesId) => {
        const { stackedData, data } = series[seriesId];

        const [seriesMin, seriesMax] = getSeriesExtremums(data, stackedData);
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [Infinity, -Infinity],
    );
};
