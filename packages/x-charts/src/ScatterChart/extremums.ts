import { AxisConfig } from '../models/axis';
import { ScatterSeriesType } from '../models/seriesType';

type GetExtremumParamsX = {
  series: { [id: string]: ScatterSeriesType };
  xAxis: AxisConfig;
};
type GetExtremumParamsY = {
  series: { [id: string]: ScatterSeriesType };
  yAxis: AxisConfig;
};

type NUllableExtremum = [number, number] | [null, null];
type GetExtremumResult = NUllableExtremum;

const mergeMinMax = (acc: NUllableExtremum, val: NUllableExtremum): NUllableExtremum => {
  if (acc[0] === null || acc[1] === null) {
    return val;
  }
  if (val[0] === null || val[1] === null) {
    return acc;
  }
  return [Math.min(acc[0], val[0]), Math.max(acc[1], val[1])];
};

export const getExtremumX = (params: GetExtremumParamsX): GetExtremumResult => {
  const { series, xAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => series[seriesId].xAxisKey === xAxis.id)
    .reduce(
      (acc: NUllableExtremum, seriesId) => {
        const seriesMinMax = series[seriesId].data.reduce(
          (accSeries: NUllableExtremum, { x }) => {
            const val = [x, x] as NUllableExtremum;
            return mergeMinMax(accSeries, val);
          },
          [null, null],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [null, null] as NUllableExtremum,
    );
};

export const getExtremumY = (params: GetExtremumParamsY): GetExtremumResult => {
  const { series, yAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => series[seriesId].yAxisKey === yAxis.id)
    .reduce(
      (acc: NUllableExtremum, seriesId) => {
        const seriesMinMax = series[seriesId].data.reduce(
          (accSeries: NUllableExtremum, { y }) => {
            const val = [y, y] as NUllableExtremum;
            return mergeMinMax(accSeries, val);
          },
          [null, null],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [null, null] as NUllableExtremum,
    );
};
