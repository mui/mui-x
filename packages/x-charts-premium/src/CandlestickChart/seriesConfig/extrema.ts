import { type CartesianExtremumGetter, findMinMax } from '@mui/x-charts/internals';

const getBaseExtremum: CartesianExtremumGetter<'ohlc'> = (params) => {
  const { axis, getFilters, isDefaultAxis } = params;

  const filter = getFilters?.({
    currentAxisId: axis.id,
    isDefaultAxis,
  });

  const data = filter ? axis.data?.filter((_, i) => filter({ x: null, y: null }, i)) : axis.data;

  return findMinMax(data ?? []);
};

const getValueExtremum: CartesianExtremumGetter<'ohlc'> = (params) => {
  const { series, axis, getFilters, isDefaultAxis } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const axisId = series[seriesId].yAxisId;
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
          (seriesAcc, values, index) => {
            if (values == null) {
              return seriesAcc;
            }

            if (
              filter &&
              (!filter({ x: null, y: values[0] }, index) ||
                !filter({ x: null, y: values[1] }, index) ||
                !filter({ x: null, y: values[2] }, index) ||
                !filter({ x: null, y: values[3] }, index))
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

export const getExtremumX: CartesianExtremumGetter<'ohlc'> = (params) => {
  return getBaseExtremum(params);
};

export const getExtremumY: CartesianExtremumGetter<'ohlc'> = (params) => {
  return getValueExtremum(params);
};
