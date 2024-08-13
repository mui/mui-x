import {
  ExtremumGetter,
  ExtremumGetterResult,
} from '../context/PluginProvider/ExtremumGetter.types';

export const getExtremumX: ExtremumGetter<'line'> = (params) => {
  const { axis } = params;

  const minX = Math.min(...(axis.data ?? []));
  const maxX = Math.max(...(axis.data ?? []));
  return [minX, maxX];
};

type GetValuesTypes = (d: [number, number]) => [number, number];

function getSeriesExtremums(
  getValues: GetValuesTypes,
  stackedData: [number, number][],
): ExtremumGetterResult {
  if (stackedData.length === 0) {
    return [null, null];
  }
  return stackedData.reduce((seriesAcc, stackedValue) => {
    const [base, value] = getValues(stackedValue);

    if (seriesAcc[0] === null) {
      return [Math.min(base, value), Math.max(base, value)] as [number, number];
    }
    return [Math.min(base, value, seriesAcc[0]), Math.max(base, value, seriesAcc[1])];
  }, getValues(stackedData[0]));
}

export const getExtremumY: ExtremumGetter<'line'> = (params) => {
  const { series, axis, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const yAxisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
      return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
    })
    .reduce(
      (acc: ExtremumGetterResult, seriesId) => {
        const { area, stackedData } = series[seriesId];
        const isArea = area !== undefined;

        // Since this series is not used to display an area, we do not consider the base (the d[0]).
        const getValues: GetValuesTypes =
          isArea && axis.scaleType !== 'log' && typeof series[seriesId].baseline !== 'string'
            ? (d) => d
            : (d) => [d[1], d[1]];

        const seriesExtremums = getSeriesExtremums(getValues, stackedData);

        if (acc[0] === null) {
          return seriesExtremums;
        }
        if (seriesExtremums[0] === null) {
          return acc;
        }

        const [seriesMin, seriesMax] = seriesExtremums;
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [null, null],
    );
};
