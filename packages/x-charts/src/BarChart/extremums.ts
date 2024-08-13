import { ExtremumGetter } from '../context/PluginProvider/ExtremumGetter.types';

const getBaseExtremum: ExtremumGetter<'bar'> = (params) => {
  const { axis, filters } = params;

  const filter = filters?.[axis.id];

  const data = filter ? axis.data?.filter(filter) : axis.data;
  const minX = Math.min(...(data ?? []));
  const maxX = Math.max(...(data ?? []));
  return [minX, maxX];
};

const getValueExtremum: ExtremumGetter<'bar'> = (params) => {
  const { series, axis, filters, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const yAxisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
      return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
    })
    .reduce(
      (acc, seriesId) => {
        const { stackedData, xAxisId, xAxisKey, yAxisId, yAxisKey } = series[seriesId];
        const xId = xAxisId ?? xAxisKey;
        const yId = yAxisId ?? yAxisKey;

        const axisId = axis.id === yId ? xId : yId;
        const filter = isDefaultAxis ? Object.values(filters ?? {})[0] : filters?.[axisId ?? ''];

        const [seriesMin, seriesMax] = stackedData?.reduce(
          (seriesAcc, values, index) => {
            if (filter && (!filter(values[0], index) || !filter(values[1], index))) {
              return seriesAcc;
            }

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
