import { type CartesianExtremumGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getScatterPoint, isColumnarScatterData } from '../scatterDataAccess';

export const getExtremumX: CartesianExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;

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

    const seriesData = series[seriesId].data;
    if (seriesData === undefined) {
      continue;
    }

    if (isColumnarScatterData(seriesData)) {
      const xs = seriesData.x;
      const length = seriesData.length;
      if (!filter) {
        // Fast path: tight typed-array loop, no per-point allocations.
        // Guard against non-finite values — they would pull the axis
        // domain to ±Infinity and blank the chart out.
        for (let i = 0; i < length; i += 1) {
          const x = xs[i];
          if (!Number.isFinite(x)) {
            continue;
          }
          if (x < min) {
            min = x;
          }
          if (x > max) {
            max = x;
          }
        }
      } else {
        for (let i = 0; i < length; i += 1) {
          if (!filter(getScatterPoint(seriesData, i), i)) {
            continue;
          }
          const x = xs[i];
          if (!Number.isFinite(x)) {
            continue;
          }
          if (x < min) {
            min = x;
          }
          if (x > max) {
            max = x;
          }
        }
      }
      continue;
    }

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

    const seriesData = series[seriesId].data;
    if (seriesData === undefined) {
      continue;
    }

    if (isColumnarScatterData(seriesData)) {
      const ys = seriesData.y;
      const length = seriesData.length;
      if (!filter) {
        for (let i = 0; i < length; i += 1) {
          const y = ys[i];
          if (!Number.isFinite(y)) {
            continue;
          }
          if (y < min) {
            min = y;
          }
          if (y > max) {
            max = y;
          }
        }
      } else {
        for (let i = 0; i < length; i += 1) {
          if (!filter(getScatterPoint(seriesData, i), i)) {
            continue;
          }
          const y = ys[i];
          if (!Number.isFinite(y)) {
            continue;
          }
          if (y < min) {
            min = y;
          }
          if (y > max) {
            max = y;
          }
        }
      }
      continue;
    }

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
