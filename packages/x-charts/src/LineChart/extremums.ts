import { ExtremumGetter, ExtremumFilter } from '../context/PluginProvider/ExtremumGetter.types';

export const getExtremumX: ExtremumGetter<'line'> = (params) => {
  const { axis } = params;

  const minX = Math.min(...(axis.data ?? []));
  const maxX = Math.max(...(axis.data ?? []));
  return [minX, maxX];
};

type GetValues = (d: [number, number]) => [number, number];

function getSeriesExtremums(
  getValues: GetValues,
  data: (number | null)[],
  stackedData: [number, number][],
  filter?: ExtremumFilter,
): [number, number] {
  return stackedData.reduce<[number, number]>(
    (seriesAcc, stackedValue, index) => {
      if (data[index] === null) {
        return seriesAcc;
      }
      const [base, value] = getValues(stackedValue);
      if (
        filter &&
        (!filter({ y: base, x: null }, index) || !filter({ y: value, x: null }, index))
      ) {
        return seriesAcc;
      }

      return [Math.min(base, value, seriesAcc[0]), Math.max(base, value, seriesAcc[1])];
    },
    [Infinity, -Infinity],
  );
}

export const getExtremumY: ExtremumGetter<'line'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const yAxisId = series[seriesId].yAxisId;
      return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
    })
    .reduce(
      (acc, seriesId) => {
        const { area, stackedData, data } = series[seriesId];
        const isArea = area !== undefined;

        const filter = getFilters?.({
          currentAxisId: axis.id,
          isDefaultAxis,
          seriesXAxisId: series[seriesId].xAxisId,
          seriesYAxisId: series[seriesId].yAxisId,
        });

        // Since this series is not used to display an area, we do not consider the base (the d[0]).
        const getValues: GetValues =
          isArea && axis.scaleType !== 'log' && typeof series[seriesId].baseline !== 'string'
            ? (d) => d
            : (d) => [d[1], d[1]];

        const seriesExtremums = getSeriesExtremums(getValues, data, stackedData, filter);

        const [seriesMin, seriesMax] = seriesExtremums;
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [Infinity, -Infinity],
    );
};
