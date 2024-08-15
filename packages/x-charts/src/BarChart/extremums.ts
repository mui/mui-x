import {
  ExtremumGetter,
  ExtremumGetterResult,
} from '../context/PluginProvider/ExtremumGetter.types';

const getBaseExtremum: ExtremumGetter<'bar'> = (params) => {
  const { axis } = params;

  const minX = Math.min(...(axis.data ?? []));
  const maxX = Math.max(...(axis.data ?? []));
  return [minX, maxX];
};

const getValueExtremum: ExtremumGetter<'bar'> = (params) => {
  const { series, axis, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const yAxisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
      return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
    })
    .reduce(
      (acc: ExtremumGetterResult, seriesId) => {
        const [seriesMin, seriesMax] = series[seriesId].stackedData?.reduce(
          (seriesAcc, values) => {
            return [Math.min(...values, seriesAcc[0]), Math.max(...values, seriesAcc[1])];
          },
          [Infinity, -Infinity],
        ) ?? [Infinity, -Infinity];

        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [Infinity, -Infinity],
    );
};

export const getExtremumX: ExtremumGetter<'bar'> = (params) => {
  // Notice that bar should be all horizontal or all vertical.
  // Don't think it's a problem for now
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    return getValueExtremum(params);
  }
  return getBaseExtremum(params);
};

export const getExtremumY: ExtremumGetter<'bar'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    return getBaseExtremum(params);
  }
  return getValueExtremum(params);
};
