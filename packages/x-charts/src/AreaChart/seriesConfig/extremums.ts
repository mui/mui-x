import {
  CartesianExtremumFilter,
  CartesianExtremumGetter,
} from '../../internals/plugins/models/seriesConfig';
import { findMinMax } from '../../internals/findMinMax';

export const getExtremumX: CartesianExtremumGetter<'areaRange'> = (params) => {
  const { axis } = params;

  return findMinMax(axis.data ?? []);
};

function getSeriesExtremums(
  data: readonly ({ start: number; end: number } | null)[],
  filter?: CartesianExtremumFilter,
): [number, number] {
  let min = Infinity;
  let max = -Infinity;

  for (let index = 0; index < data.length; index += 1) {
    const datum = data[index];
    if (!datum) {
      continue;
    }

    if (
      filter &&
      (!filter({ y: datum.start, x: null }, index) || !filter({ y: datum.end, x: null }, index))
    ) {
      continue;
    }

    min = Math.min(datum.start, datum.end, min);
    max = Math.max(datum.start, datum.end, max);
  }

  return [min, max];
}

export const getExtremumY: CartesianExtremumGetter<'areaRange'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const yAxisId = series[seriesId].yAxisId;
      return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
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

        const seriesExtremums = getSeriesExtremums(data, filter);

        const [seriesMin, seriesMax] = seriesExtremums;
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
      },
      [Infinity, -Infinity],
    );
};
