import { PolarExtremumGetter } from '../../internals/plugins/models/seriesConfig';

export const radiusExtremumGetter: PolarExtremumGetter<'radar'> = ({ series, axisIndex }) => {
  return Object.keys(series)
    .filter((seriesId) => series[seriesId].type === 'radar')
    .reduce<[number, number]>(
      (acc, seriesId) => {
        const { data } = series[seriesId];

        return [Math.min(data[axisIndex], acc[0]), Math.max(data[axisIndex], acc[1])];
      },
      [Infinity, -Infinity],
    );
};

export const rotationExtremumGetter: PolarExtremumGetter<'radar'> = ({ axis }) => {
  const min = Math.min(...(axis.data ?? []));
  const max = Math.max(...(axis.data ?? []));

  return [min, max];
};
