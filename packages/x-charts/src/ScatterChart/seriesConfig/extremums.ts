import { CartesianExtremumGetter } from '../../internals/plugins/models/seriesConfig';

export const getExtremumX: CartesianExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;
  performance.mark('ScatterChart getExtremumX-start');

  let min = Infinity;
  let max = -Infinity;

  for (const seriesId in series) {
    if (!Object.hasOwn(series, seriesId)) {
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

  performance.mark('ScatterChart getExtremumX-end');
  performance.measure(
    'ScatterChart getExtremumX',
    'ScatterChart getExtremumX-start',
    'ScatterChart getExtremumX-end',
  );

  return [min, max];
};

export const getExtremumY: CartesianExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;
  performance.mark('ScatterChart getExtremumY-start');

  let min = Infinity;
  let max = -Infinity;

  for (const seriesId in series) {
    if (!Object.hasOwn(series, seriesId)) {
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

  performance.mark('ScatterChart getExtremumY-end');
  performance.measure(
    'ScatterChart getExtremumY - mark',
    'ScatterChart getExtremumY-start',
    'ScatterChart getExtremumY-end',
  );

  return [min, max];
};
