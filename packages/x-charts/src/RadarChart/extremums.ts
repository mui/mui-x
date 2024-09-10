import { ExtremumGetter } from '../context/PluginProvider/ExtremumGetter.types';

export const radiusExtremumGetter: ExtremumGetter<'radar'> = ({ series }) => {
  return Object.keys(series)
    .filter((seriesId) => series[seriesId].type === 'radar')
    .reduce<[number, number]>(
      (acc, seriesId) => {
        const { data } = series[seriesId];

        return [Math.min(...data, acc[0]), Math.max(...data, acc[1])];
      },
      [Infinity, -Infinity],
    );
};
