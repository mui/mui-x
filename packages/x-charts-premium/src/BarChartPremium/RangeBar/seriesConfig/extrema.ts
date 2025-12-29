import { type CartesianExtremumGetter, findMinMax } from '@mui/x-charts/internals';
import { type RangeBarValueType } from '../../../models';

const createResult = (data: any, direction: 'x' | 'y') => {
  if (direction === 'x') {
    return { x: data, y: null };
  }
  return { x: null, y: data };
};

const getBaseExtremum: CartesianExtremumGetter<'rangeBar'> = (params) => {
  const { axis, getFilters, isDefaultAxis } = params;

  const filter = getFilters?.({
    currentAxisId: axis.id,
    isDefaultAxis,
  });

  const data = filter ? axis.data?.filter((_, i) => filter({ x: null, y: null }, i)) : axis.data;

  return findMinMax(data ?? []);
};

const getValueExtremum =
  (direction: 'x' | 'y'): CartesianExtremumGetter<'rangeBar'> =>
  (params) => {
    const { series, axis, getFilters, isDefaultAxis } = params;

    return Object.keys(series)
      .filter((seriesId) => {
        const axisId = direction === 'x' ? series[seriesId].xAxisId : series[seriesId].yAxisId;
        return axisId === axis.id || (isDefaultAxis && axisId === undefined);
      })
      .reduce(
        (acc, seriesId) => {
          const { data } = series[seriesId];

          const filter = getFilters?.({
            currentAxisId: axis.id,
            isDefaultAxis,
            seriesXAxisId: series[seriesId].xAxisId,
            seriesYAxisId: series[seriesId].yAxisId,
          });

          const [seriesMin, seriesMax] = data?.reduce(
            (seriesAcc: RangeBarValueType, values, index) => {
              if (values == null) {
                return seriesAcc;
              }

              if (
                filter &&
                (!filter(createResult(values[0], direction), index) ||
                  !filter(createResult(values[1], direction), index))
              ) {
                return seriesAcc;
              }

              return [
                Math.min(values[0], values[1], seriesAcc[0]),
                Math.max(values[0], values[1], seriesAcc[1]),
              ];
            },
            [Infinity, -Infinity],
          ) ?? [Infinity, -Infinity];

          return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
        },
        [Infinity, -Infinity],
      );
  };

export const getExtremumX: CartesianExtremumGetter<'rangeBar'> = (params) => {
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

export const getExtremumY: CartesianExtremumGetter<'rangeBar'> = (params) => {
  const isHorizontal = Object.keys(params.series).some(
    (seriesId) => params.series[seriesId].layout === 'horizontal',
  );
  if (isHorizontal) {
    return getBaseExtremum(params);
  }
  return getValueExtremum('y')(params);
};
