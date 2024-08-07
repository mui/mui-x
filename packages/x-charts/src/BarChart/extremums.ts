import {
  ExtremumGetter,
  ExtremumGetterResult,
} from '../context/PluginProvider/ExtremumGetter.types';

const getBaseExtremum: ExtremumGetter<'bar'> = (params) => {
  const { axis, filter } = params;

  const data = filter !== undefined ? axis.data?.filter(filter) : axis.data;
  const minX = Math.min(...(data ?? []));
  const maxX = Math.max(...(data ?? []));
  return [minX, maxX];
};

const getValueExtremum: ExtremumGetter<'bar'> = (params) => {
  const { series, axis, isDefaultAxis, filter } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const yAxisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
      return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
    })
    .reduce(
      (acc: ExtremumGetterResult, seriesId) => {
        const data =
          filter !== undefined
            ? series[seriesId].stackedData.filter((v, i) => filter(v[0], i) && filter(v[1], i))
            : series[seriesId].stackedData;
        const [seriesMin, seriesMax] = data?.reduce(
          (seriesAcc, values) => [
            Math.min(...values, ...(seriesAcc[0] === null ? [] : [seriesAcc[0]])),
            Math.max(...values, ...(seriesAcc[1] === null ? [] : [seriesAcc[1]])),
          ],
          series[seriesId].stackedData[0],
        ) ?? [null, null];

        return [
          acc[0] === null ? seriesMin : Math.min(seriesMin, acc[0]),
          acc[1] === null ? seriesMax : Math.max(seriesMax, acc[1]),
        ];
      },
      [null, null],
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
