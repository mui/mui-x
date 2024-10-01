import { ExtremumGetter } from '../context/PluginProvider/ExtremumGetter.types';

const createResult = (data: any, direction: 'x' | 'y') => {
  if (direction === 'x') {
    return { x: data, y: null };
  }
  return { x: null, y: data };
};

const getValueExtremum =
  (direction: 'x' | 'y', isMain: boolean): ExtremumGetter<'funnel'> =>
  (params) => {
    const { series, axis, getFilters, isDefaultAxis } = params;

    // Only return max value

    return Object.keys(series)
      .filter((seriesId) => {
        const yAxisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
        return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
      })
      .reduce(
        (acc, seriesId) => {
          const { stackedDataMain, stackedDataOther } = series[seriesId];

          const filter = getFilters?.({
            currentAxisId: axis.id,
            isDefaultAxis,
            seriesXAxisId: series[seriesId].xAxisId ?? series[seriesId].xAxisKey,
            seriesYAxisId: series[seriesId].yAxisId ?? series[seriesId].yAxisKey,
          });

          const [seriesMin, seriesMax] = (isMain ? stackedDataMain : stackedDataOther)?.reduce(
            (seriesAcc, values, index) => {
              if (
                filter &&
                (!filter(createResult(values.v0, direction), index) ||
                  !filter(createResult(values.v1, direction), index) ||
                  !filter(createResult(values.v2, direction), index) ||
                  !filter(createResult(values.v3, direction), index))
              ) {
                return seriesAcc;
              }

              return [
                Math.min(...Object.values(values), seriesAcc[0]),
                Math.max(...Object.values(values), seriesAcc[1]),
              ];
            },
            [Infinity, -Infinity],
          ) ?? [Infinity, -Infinity];

          return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
        },
        [Infinity, -Infinity],
      );
  };

export const getExtremumX: ExtremumGetter<'funnel'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    return getValueExtremum('x', false)(params);
  }
  return getValueExtremum('x', true)(params);
};

export const getExtremumY: ExtremumGetter<'funnel'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    return getValueExtremum('y', true)(params);
  }
  return getValueExtremum('y', false)(params);
};
