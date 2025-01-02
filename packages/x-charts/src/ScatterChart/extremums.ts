import {
  ExtremumGetter,
  ExtremumGetterResult,
} from '../context/PluginProvider/ExtremumGetter.types';

const mergeMinMax = (
  acc: ExtremumGetterResult,
  val: ExtremumGetterResult,
): ExtremumGetterResult => [
  val[0] === null ? acc[0] : Math.min(acc[0], val[0]),
  val[1] === null ? acc[1] : Math.max(acc[1], val[1]),
];

export const getExtremumX: ExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const axisId = series[seriesId].xAxisId;
      return axisId === axis.id || (axisId === undefined && isDefaultAxis);
    })
    .reduce(
      (acc, seriesId) => {
        const filter = getFilters?.({
          currentAxisId: axis.id,
          isDefaultAxis,
          seriesXAxisId: series[seriesId].xAxisId,
          seriesYAxisId: series[seriesId].yAxisId,
        });

        const seriesMinMax = series[seriesId].data?.reduce<ExtremumGetterResult>(
          (accSeries, d, dataIndex) => {
            if (filter && !filter(d, dataIndex)) {
              return accSeries;
            }
            return mergeMinMax(accSeries, [d.x, d.x]);
          },
          [Infinity, -Infinity],
        );
        return mergeMinMax(acc, seriesMinMax ?? [Infinity, -Infinity]);
      },
      [Infinity, -Infinity],
    );
};

export const getExtremumY: ExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const axisId = series[seriesId].yAxisId;
      return axisId === axis.id || (axisId === undefined && isDefaultAxis);
    })
    .reduce(
      (acc, seriesId) => {
        const filter = getFilters?.({
          currentAxisId: axis.id,
          isDefaultAxis,
          seriesXAxisId: series[seriesId].xAxisId,
          seriesYAxisId: series[seriesId].yAxisId,
        });

        const seriesMinMax = series[seriesId].data?.reduce<ExtremumGetterResult>(
          (accSeries, d, dataIndex) => {
            if (filter && !filter(d, dataIndex)) {
              return accSeries;
            }
            return mergeMinMax(accSeries, [d.y, d.y]);
          },
          [Infinity, -Infinity],
        );
        return mergeMinMax(acc, seriesMinMax ?? [Infinity, -Infinity]);
      },
      [Infinity, -Infinity],
    );
};
