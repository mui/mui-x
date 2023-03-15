import { AxisConfig } from '../models/axis';
import { StackedLineSeriesType } from './formatter';

type GetExtremumParamsX = {
  series: { [id: string]: StackedLineSeriesType };
  xAxis: AxisConfig;
};
type GetExtremumParamsY = {
  series: { [id: string]: StackedLineSeriesType };
  yAxis: AxisConfig;
};

type GetExtremumResult = [number, number] | [null, null];

export const getExtremumX = (params: GetExtremumParamsX): GetExtremumResult => {
  const { xAxis } = params;

  const minX = Math.min(...(xAxis.data ?? []));
  const maxX = Math.max(...(xAxis.data ?? []));
  return [minX, maxX];
};

export const getExtremumY = (params: GetExtremumParamsY): GetExtremumResult => {
  const { series, yAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => series[seriesId].yAxisKey === yAxis.id)
    .reduce(
      (acc: GetExtremumResult, seriesId) => {
        const isArea = series[seriesId].area !== undefined;

        const getValues = isArea
          ? (d: [number, number]) => d
          : (d: [number, number]) => [d[1], d[1]]; // Id area should go from bottom to top, without area should only consider the top

        const [seriesMin, serriesMax] = series[seriesId].stackedData.reduce(
          (seriesAcc, stackedValue) => {
            const [min, max] = getValues(stackedValue);
            return [Math.min(min, seriesAcc[0]), Math.max(max, seriesAcc[1])];
          },
          getValues(series[seriesId].stackedData[0]),
        );

        if (acc[0] === null || acc[1] === null) {
          return [seriesMin, serriesMax];
        }
        return [Math.min(seriesMin, acc[0]), Math.max(serriesMax, acc[1])];
      },
      [null, null],
    );
};
