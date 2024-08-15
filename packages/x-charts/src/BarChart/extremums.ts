import { ExtremumGetter } from '../context/PluginProvider/ExtremumGetter.types';

const createResult = (data: any, direction: 'x' | 'y') => {
  if (direction === 'x') {
    return { x: data, y: null };
  }
  return { x: null, y: data };
};

const getBaseExtremum: ExtremumGetter<'bar'> = (params) => {
  const { axis, getFilters, isDefaultAxis } = params;

  const filter = getFilters?.({
    currentAxisId: axis.id,
    isDefaultAxis,
  });

  const data = filter ? axis.data?.filter((_, i) => filter({ x: null, y: null }, i)) : axis.data;
  const minX = Math.min(...(data ?? []));
  const maxX = Math.max(...(data ?? []));
  return [minX, maxX];
};

const getValueExtremum =
  (direction: 'x' | 'y'): ExtremumGetter<'bar'> =>
  (params) => {
    const { series, axis, getFilters, isDefaultAxis } = params;

    return Object.keys(series)
      .filter((seriesId) => {
        const yAxisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
        return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
      })
      .reduce(
        (acc, seriesId) => {
          const { stackedData } = series[seriesId];

          const filter = getFilters?.({
            currentAxisId: axis.id,
            isDefaultAxis,
            seriesXAxisId: series[seriesId].xAxisId ?? series[seriesId].xAxisKey,
            seriesYAxisId: series[seriesId].yAxisId ?? series[seriesId].yAxisKey,
          });

          const [seriesMin, seriesMax] = stackedData?.reduce(
            (seriesAcc, values, index) => {
              if (
                filter &&
                (!filter(createResult(values[0], direction), index) ||
                  !filter(createResult(values[1], direction), index))
              ) {
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
    return getValueExtremum('x')(params);
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
  return getValueExtremum('y')(params);
};
