import { type PolarExtremumGetter } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

export const getRadiusExtremum: PolarExtremumGetter<'bar'> = ({ series, axisIndex }) => {
  return Object.keys(series)
    .filter((seriesId) => series[seriesId].type === 'bar')
    .reduce<[number, number]>(
      (acc, seriesId) => {
        const { stackedData } = series[seriesId];
        if (!stackedData?.[axisIndex]) {
          return acc;
        }
        const [base, value] = stackedData[axisIndex];
        return [Math.min(base, value, acc[0]), Math.max(base, value, acc[1])];
      },
      [Infinity, -Infinity],
    );
};

export const getRotationExtremum: PolarExtremumGetter<'bar'> = ({ axis }) => {
  const min = Math.min(...(axis.data ?? []));
  const max = Math.max(...(axis.data ?? []));

  return [min, max];
};
