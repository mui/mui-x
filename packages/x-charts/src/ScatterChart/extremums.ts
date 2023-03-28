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

type NullableExtremum = [number, number] | [null, null];
type GetExtremumResult = NullableExtremum;

const mergeMinMax = (acc: NullableExtremum, val: NullableExtremum): NullableExtremum => {
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
      (acc: NullableExtremum, seriesId) => {
        const seriesMinMax = series[seriesId].data.reduce(
          (accSeries: NullableExtremum, { x }) => {
            const val = [x, x] as NullableExtremum;
            return mergeMinMax(accSeries, val);
          },
          [null, null],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [null, null] as NullableExtremum,
    );
};

export const getExtremumY = (params: GetExtremumParamsY): GetExtremumResult => {
  const { series, yAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => series[seriesId].yAxisKey === yAxis.id)
    .reduce(
      (acc: NullableExtremum, seriesId) => {
        const seriesMinMax = series[seriesId].data.reduce(
          (accSeries: NullableExtremum, { y }) => {
            const val = [y, y] as NullableExtremum;
            return mergeMinMax(accSeries, val);
          },
          [null, null],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [null, null] as NullableExtremum,
    );
};
