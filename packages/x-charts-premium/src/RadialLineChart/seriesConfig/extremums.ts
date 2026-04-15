import { findMinMax, type PolarExtremumGetter } from '@mui/x-charts/internals';

export const rotationExtremumGetter: PolarExtremumGetter<'radial-line'> = (params) => {
  const { axis } = params;

  return findMinMax(axis.data ?? []);
};

type GetValues = (d: [number, number]) => [number, number];

function getSeriesExtremums(
  getValues: GetValues,
  data: readonly (number | null)[],
  stackedData: [number, number][],
): [number, number] {
  return stackedData.reduce<[number, number]>(
    (seriesAcc, stackedValue, index) => {
      if (data[index] === null) {
        return seriesAcc;
      }
      const [base, value] = getValues(stackedValue);

      return [Math.min(base, value, seriesAcc[0]), Math.max(base, value, seriesAcc[1])];
    },
    [Infinity, -Infinity],
  );
}

export const radiusExtremumGetter: PolarExtremumGetter<'radial-line'> = (params) => {
  const { series, axis, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const radiusAxisId = series[seriesId].radiusAxisId;
      return radiusAxisId === axis.id || (isDefaultAxis && radiusAxisId === undefined);
    })
    .reduce(
      (acc, seriesId) => {
        const { area, stackedData, data } = series[seriesId];
        const isArea = area !== undefined;

        // Since this series is not used to display an area, we do not consider the base (the d[0]).
        const getValues: GetValues =
          isArea && axis.scaleType !== 'log' && typeof series[seriesId].baseline !== 'string'
            ? (d) => d
            : (d) => [d[1], d[1]];

        const seriesExtremums = getSeriesExtremums(getValues, data, stackedData);

        const [seriesMin, seriesMax] = seriesExtremums;
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [Infinity, -Infinity],
    );
};
