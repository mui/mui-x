import { ExtremumGetter, ExtremumGetterResult } from '../models/seriesType/config';

const mergeMinMax = (
  acc: ExtremumGetterResult,
  val: ExtremumGetterResult,
): ExtremumGetterResult => {
  if (acc[0] === null || acc[1] === null) {
    return val;
  }
  if (val[0] === null || val[1] === null) {
    return acc;
  }
  return [Math.min(acc[0], val[0]), Math.max(acc[1], val[1])];
};

export const getExtremumX: ExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const axisId = series[seriesId].xAxisId ?? series[seriesId].xAxisKey;
      return axisId === axis.id || (axisId === undefined && isDefaultAxis);
    })
    .reduce(
      (acc: ExtremumGetterResult, seriesId) => {
        const seriesMinMax = series[seriesId].data.reduce(
          (accSeries: ExtremumGetterResult, { x }) => {
            const val = [x, x] as ExtremumGetterResult;
            return mergeMinMax(accSeries, val);
          },
          [null, null],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [null, null] as ExtremumGetterResult,
    );
};

export const getExtremumY: ExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const axisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
      return axisId === axis.id || (axisId === undefined && isDefaultAxis);
    })
    .reduce(
      (acc: ExtremumGetterResult, seriesId) => {
        const seriesMinMax = series[seriesId].data.reduce(
          (accSeries: ExtremumGetterResult, { y }) => {
            const val = [y, y] as ExtremumGetterResult;
            return mergeMinMax(accSeries, val);
          },
          [null, null],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [null, null] as ExtremumGetterResult,
    );
};
