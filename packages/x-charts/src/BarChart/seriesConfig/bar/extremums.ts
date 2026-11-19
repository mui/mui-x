import type { CartesianExtremumGetter } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';
import { findMinMax } from '../../../internals/findMinMax';
import { getBarBaselineValue, getBarExtent } from '../../../internals/createGetBarDimensions';

const createResult = (data: any, direction: 'x' | 'y') => {
  if (direction === 'x') {
    return { x: data, y: null };
  }
  return { x: null, y: data };
};

const getBaseExtremum: CartesianExtremumGetter<'bar'> = (params) => {
  const { axis, getFilters, isDefaultAxis } = params;

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

    return Object.keys(series)
      .filter((seriesId) => {
        const axisId = direction === 'x' ? series[seriesId].xAxisId : series[seriesId].yAxisId;

        if (axis.domainSeries === 'visible' && series[seriesId].hidden) {
          return false;
        }
        return axisId === axis.id || (isDefaultAxis && axisId === undefined);
      })
      .reduce(
        (acc, seriesId) => {
          const { stackedData, visibleStackedData, data, baseline, stack } = series[seriesId];
          // `'min'`/`'max'` give infinite bar starts, which are left out of the domain.
          const baselineValue = getBarBaselineValue(baseline);
          const isInDomain = (v: number) =>
            Number.isFinite(v) && (axis.scaleType !== 'log' || v > 0);

          const filter = getFilters?.({
            currentAxisId: axis.id,
            isDefaultAxis,
            seriesXAxisId: series[seriesId].xAxisId,
            seriesYAxisId: series[seriesId].yAxisId,
          });

          const stackedDataToUse =
            axis.domainSeries === 'visible' ? visibleStackedData : stackedData;
          const [seriesMin, seriesMax] = stackedDataToUse?.reduce(
            (seriesAcc, values, index) => {
              if (
                filter &&
                (!filter(createResult(values[0], direction), index) ||
                  !filter(createResult(values[1], direction), index))
              ) {
                return seriesAcc;
              }

              const extent = getBarExtent(
                values,
                data[index],
                baselineValue,
                stack !== undefined,
              ).filter(isInDomain);
              return [Math.min(...extent, seriesAcc[0]), Math.max(...extent, seriesAcc[1])];
            },
            [Infinity, -Infinity],
          ) ?? [Infinity, -Infinity];

          return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
        },
        [Infinity, -Infinity],
      );
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
