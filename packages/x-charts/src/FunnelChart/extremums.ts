import { ExtremumGetter } from '../context/PluginProvider/ExtremumGetter.types';

const createResult = (data: any, direction: 'x' | 'y') => {
  if (direction === 'x') {
    return { x: data, y: null };
  }
  return { x: null, y: data };
};

const getValueExtremum =
  (direction: 'x' | 'y'): ExtremumGetter<'funnel'> =>
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

export const getExtremumX: ExtremumGetter<'funnel'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  const d = (() => {
    if (isHorizontal) {
      return getValueExtremum('x')(params);
    }
    return getValueExtremum('y')(params);
  })();
  console.log('x', d);
  return d;
};

export const getExtremumY: ExtremumGetter<'funnel'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  const d = (() => {
    if (isHorizontal) {
      return getValueExtremum('x')(params);
    }
    return getValueExtremum('y')(params);
  })();
  console.log('y', d);
  return d;
};
