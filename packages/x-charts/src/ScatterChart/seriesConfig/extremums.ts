import {
  CartesianExtremumGetter,
  CartesianExtremumGetterResult,
} from '../../internals/plugins/models/seriesConfig';

const mergeMinMax = (
  acc: CartesianExtremumGetterResult,
  val: CartesianExtremumGetterResult,
): CartesianExtremumGetterResult => {
  return [
    val[0] === null ? acc[0] : Math.min(acc[0], val[0]),
    val[1] === null ? acc[1] : Math.max(acc[1], val[1]),
  ];
};

export const getExtremumX: CartesianExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;

  let min = Infinity;
  let max = -Infinity;

  for (const seriesId in series) {
    if (!Object.prototype.hasOwnProperty.call(series, seriesId)) {
      continue;
    }

    const axisId = series[seriesId].xAxisId;
    if (!(axisId === axis.id || (axisId === undefined && isDefaultAxis))) {
      continue;
    }

    const filter = getFilters?.({
      currentAxisId: axis.id,
      isDefaultAxis,
      seriesXAxisId: series[seriesId].xAxisId,
      seriesYAxisId: series[seriesId].yAxisId,
    });

    const seriesData = series[seriesId].data ?? [];

    for (let i = 0; i < seriesData.length; i += 1) {
      const d = seriesData[i];

      if (filter && !filter(d, i)) {
        continue;
      }

      if (d.x !== null) {
        if (d.x < min) {
          min = d.x;
        }
        if (d.x > max) {
          max = d.x;
        }
      }
    }
  }

  return [min, max];
};

export const getExtremumY: CartesianExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;

  let min = Infinity;
  let max = -Infinity;

  for (const seriesId in series) {
    if (!Object.prototype.hasOwnProperty.call(series, seriesId)) {
      continue;
    }

    const axisId = series[seriesId].yAxisId;
    if (!(axisId === axis.id || (axisId === undefined && isDefaultAxis))) {
      continue;
    }

    const filter = getFilters?.({
      currentAxisId: axis.id,
      isDefaultAxis,
      seriesXAxisId: series[seriesId].xAxisId,
      seriesYAxisId: series[seriesId].yAxisId,
    });

    const seriesData = series[seriesId].data ?? [];

    for (let i = 0; i < seriesData.length; i += 1) {
      const d = seriesData[i];

      if (filter && !filter(d, i)) {
        continue;
      }

      if (d.y !== null) {
        if (d.y < min) {
          min = d.y;
        }
        if (d.y > max) {
          max = d.y;
        }
      }
    }
  }

  return [min, max];
};
