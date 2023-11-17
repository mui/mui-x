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

        const getValues: (d: [number, number]) => [number, number] = isArea
          ? (d) => d
          : (d) => [d[1], d[1]]; // Since this series is not used to display an area, we do not consider the base (the d[0]).

        const seriesExtremums: ExtremumGetterResult = series[seriesId].stackedData.reduce(
          (seriesAcc, stackedValue) => {
            const [base, value] = getValues(stackedValue);

            if (seriesAcc[0] === null) {
              return [Math.min(base, value), Math.max(base, value)] as [number, number];
            }
            return [Math.min(base, value, seriesAcc[0]), Math.max(base, value, seriesAcc[1])];
          },
          series[seriesId].stackedData.length > 0
            ? getValues(series[seriesId].stackedData[0])
            : [null, null],
        );

        if (acc[0] === null) {
          return seriesExtremums;
        }
        if (seriesExtremums[0] === null) {
          return acc;
        }
        const [seriesMin, seriesMax] = seriesExtremums;
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [null, null],
    );
};
