import { ExtremumGetter, ExtremumGetterResult } from '../models/seriesType/config';

export const getExtremumX: ExtremumGetter<'bar'> = (params) => {
  const { axis } = params;

  const minX = Math.min(...(axis.data ?? []));
  const maxX = Math.max(...(axis.data ?? []));
  return [minX, maxX];
};

export const getExtremumY: ExtremumGetter<'bar'> = (params) => {
  const { series, axis } = params;

  return Object.keys(series)
    .filter((seriesId) => series[seriesId].yAxisKey === axis.id)
    .reduce(
      (acc: ExtremumGetterResult, seriesId) => {
        const [seriesMin, seriesMax] = series[seriesId].stackedData.reduce(
          (seriesAcc, [min, max]) => [Math.min(min, seriesAcc[0]), Math.max(max, seriesAcc[1])],
          series[seriesId].stackedData[0],
        );
        if (acc[0] === null || acc[1] === null) {
          return [seriesMin, seriesMax];
        }
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [null, null],
    );
};
