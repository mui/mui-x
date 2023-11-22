import { ExtremumGetter, ExtremumGetterResult } from '../models/seriesType/config';

export const getExtremumX: ExtremumGetter<'line'> = (params) => {
  const { axis } = params;

  const minX = Math.min(...(axis.data ?? []));
  const maxX = Math.max(...(axis.data ?? []));
  return [minX, maxX];
};

export const getExtremumY: ExtremumGetter<'line'> = (params) => {
  const { series, axis, isDefaultAxis } = params;

  return Object.keys(series)
    .filter(
      (seriesId) =>
        series[seriesId].yAxisKey === axis.id ||
        (isDefaultAxis && series[seriesId].yAxisKey === undefined),
    )
    .reduce(
      (acc: ExtremumGetterResult, seriesId) => {
        const isArea = series[seriesId].area !== undefined;

        const getValues = isArea
          ? (d: [number, number]) => d
          : (d: [number, number]) => [d[1], d[1]]; // Id area should go from bottom to top, without area should only consider the top

        const [seriesMin, seriesMax] = series[seriesId].stackedData.reduce(
          (seriesAcc, stackedValue) => {
            const [base, value] = getValues(stackedValue);
            return [Math.min(base, value, seriesAcc[0]), Math.max(base, value, seriesAcc[1])];
          },
          getValues(series[seriesId].stackedData[0]),
        );

        if (acc[0] === null || acc[1] === null) {
          return [seriesMin, seriesMax];
        }
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [null, null],
    );
};
