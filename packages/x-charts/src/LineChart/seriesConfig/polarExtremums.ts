import { type PolarExtremumGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

export const getRadiusExtremum: PolarExtremumGetter<'line'> = ({ series, axisIndex }) => {
  return Object.keys(series)
    .filter((seriesId) => series[seriesId].type === 'line')
    .reduce<[number, number]>(
      (acc, seriesId) => {
        const value = series[seriesId].data[axisIndex];
        if (value === null) {
          return acc;
        }
        return [Math.min(value, acc[0]), Math.max(value, acc[1])];
      },
      [Infinity, -Infinity],
    );
};

export const getRotationExtremum: PolarExtremumGetter<'line'> = ({ axis }) => {
  const min = Math.min(...(axis.data ?? []));
  const max = Math.max(...(axis.data ?? []));

  return [min, max];
};
