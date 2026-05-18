import { type CartesianExtremumGetter, findMinMax } from '@mui/x-charts/internals';

export const getExtremumX: CartesianExtremumGetter<'ohlc'> = (params) => {
  const { axis, getFilters, isDefaultAxis } = params;

  const filter = getFilters?.({
    currentAxisId: axis.id,
    isDefaultAxis,
  });

  const data = filter ? axis.data?.filter((_, i) => filter({ x: null, y: null }, i)) : axis.data;

  return findMinMax(data ?? []);
};

export const getExtremumY: CartesianExtremumGetter<'ohlc'> = (params) => {
  const { series, axis, getFilters, isDefaultAxis } = params;

  let min = Infinity;
  let max = -Infinity;

  for (const seriesId in series) {
    if (!Object.hasOwn(series, seriesId)) {
      continue;
    }
    const s = series[seriesId];
    const axisId = s.yAxisId;
    if (axisId !== axis.id && !(isDefaultAxis && axisId === undefined)) {
      continue;
    }

    const filter = getFilters?.({
      currentAxisId: axis.id,
      isDefaultAxis,
      seriesXAxisId: s.xAxisId,
      seriesYAxisId: s.yAxisId,
    });

    const data = s.data;
    if (!data) {
      continue;
    }

    for (let i = 0; i < data.length; i += 1) {
      const values = data[i];
      if (values == null) {
        continue;
      }
      const open = values[0];
      const high = values[1];
      const low = values[2];
      const close = values[3];
      if (
        filter &&
        (!filter({ x: null, y: open }, i) ||
          !filter({ x: null, y: high }, i) ||
          !filter({ x: null, y: low }, i) ||
          !filter({ x: null, y: close }, i))
      ) {
        continue;
      }
      if (low < min) {
        min = low;
      }
      if (high > max) {
        max = high;
      }
    }
  }

  return [min, max];
};
