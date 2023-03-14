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

export const getExtremumX = (params: GetExtremumParamsX): GetExtremumResult => {
  const { series, xAxis } = params;

  const [minX, maxX] = Object.keys(series)
    .filter((seriesId) => series[seriesId].xAxisKey === xAxis.id)
    .reduce(
      (acc: NUllableExtremum, seriesId) => {
        const [seriesMin, seriesMax] = series[seriesId].data.reduce(
          ([min, max]: NUllableExtremum, { x }) => {
            if (min === null || max === null) {
              return [x, x] as [number, number];
            }
            return [Math.min(min, x), Math.max(max, x)];
          },
          [null, null],
        );
        if (acc[0] === null || acc[1] === null) {
          return [seriesMin, seriesMax];
        }
        if (seriesMin === null || seriesMax === null) {
          return [seriesMin, seriesMax];
        }
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [null, null],
    );

  return [minX, maxX];
};

export const getExtremumY = (params: GetExtremumParamsY): GetExtremumResult => {
  const { series, yAxis } = params;

  const [minY, maxY] = Object.keys(series)
    .filter((seriesId) => series[seriesId].yAxisKey === yAxis.id)
    .reduce(
      (acc: NUllableExtremum, seriesId) => {
        const [seriesMin, seriesMax] = series[seriesId].data.reduce(
          ([min, max]: NUllableExtremum, { y }) => {
            if (min === null || max === null) {
              return [y, y] as [number, number];
            }
            return [Math.min(min, y), Math.max(max, y)];
          },
          [null, null],
        );
        if (acc[0] === null || acc[1] === null) {
          return [seriesMin, seriesMax];
        }
        if (seriesMin === null || seriesMax === null) {
          return [seriesMin, seriesMax];
        }
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [null, null],
    );

  return [minY, maxY];
};
