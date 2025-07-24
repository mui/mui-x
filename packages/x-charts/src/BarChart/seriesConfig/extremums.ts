import { CartesianExtremumGetter } from '../../internals/plugins/models/seriesConfig';
import { findMinMax } from '../../internals/findMinMax';

const createResult = (data: any, direction: 'x' | 'y') => {
  if (direction === 'x') {
    return { x: data, y: null };
  }
  return { x: null, y: data };
};

const getBaseExtremum: CartesianExtremumGetter<'bar'> = (params) => {
  const { axis, getFilters, isDefaultAxis } = params;

  console.log(axis.data);
  const filter = getFilters?.({
    currentAxisId: axis.id,
    isDefaultAxis,
  });

  const data = filter ? axis.data?.filter((_, i) => filter({ x: null, y: null }, i)) : axis.data;

  return findMinMax(data ?? []);
};

const getValueExtremum =
  (direction: 'x' | 'y'): CartesianExtremumGetter<'bar'> =>
  (params) => {
    const { series, axis, getFilters, isDefaultAxis } = params;
    console.log('BarChart getValueExtremum', direction);
    performance.mark(`getValueExtremum-start-${direction}`);
    const start = performance.now();

    const result: [number, number] = Object.keys(series)
      .filter((seriesId) => {
        const axisId = direction === 'x' ? series[seriesId].xAxisId : series[seriesId].yAxisId;
        return axisId === axis.id || (isDefaultAxis && axisId === undefined);
      })
      .reduce(
        (acc, seriesId) => {
          const { stackedData } = series[seriesId];

          const filter = getFilters?.({
            currentAxisId: axis.id,
            isDefaultAxis,
            seriesXAxisId: series[seriesId].xAxisId,
            seriesYAxisId: series[seriesId].yAxisId,
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

    const end = performance.now();
    performance.measure(`getValueExtremum-${direction}`, { detail: { direction }, start, end });

    return result;
  };

export const getExtremumX: CartesianExtremumGetter<'bar'> = (params) => {
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

export const getExtremumY: CartesianExtremumGetter<'bar'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    return getBaseExtremum(params);
  }
  return getValueExtremum('y')(params);
};
