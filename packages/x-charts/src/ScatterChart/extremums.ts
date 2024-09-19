import {
  ExtremumGetter,
  ExtremumGetterResult,
} from '../context/PluginProvider/ExtremumGetter.types';

const mergeMinMax = (
  acc: ExtremumGetterResult,
  val: ExtremumGetterResult,
): ExtremumGetterResult => {
  return [Math.min(acc[0], val[0]), Math.max(acc[1], val[1])];
};

export const getExtremumX: ExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const axisId = series[seriesId].xAxisId ?? series[seriesId].xAxisKey;
      return axisId === axis.id || (axisId === undefined && isDefaultAxis);
    })
    .reduce(
      (acc, seriesId) => {
        const filter = getFilters?.({
          currentAxisId: axis.id,
          isDefaultAxis,
          seriesXAxisId: series[seriesId].xAxisId ?? series[seriesId].xAxisKey,
          seriesYAxisId: series[seriesId].yAxisId ?? series[seriesId].yAxisKey,
        });

        const seriesMinMax = series[seriesId].data.reduce<ExtremumGetterResult>(
          (accSeries, d, dataIndex) => {
            if (filter && !filter(d, dataIndex)) {
              return accSeries;
            }
            return mergeMinMax(accSeries, [d.x, d.x]);
          },
          [Infinity, -Infinity],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [Infinity, -Infinity],
    );
};

export const getExtremumY: ExtremumGetter<'scatter'> = (params) => {
  const { series, axis, isDefaultAxis, getFilters } = params;

  return Object.keys(series)
    .filter((seriesId) => {
      const axisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
      return axisId === axis.id || (axisId === undefined && isDefaultAxis);
    })
    .reduce(
      (acc, seriesId) => {
        const filter = getFilters?.({
          currentAxisId: axis.id,
          isDefaultAxis,
          seriesXAxisId: series[seriesId].xAxisId ?? series[seriesId].xAxisKey,
          seriesYAxisId: series[seriesId].yAxisId ?? series[seriesId].yAxisKey,
        });

        const seriesMinMax = series[seriesId].data.reduce<ExtremumGetterResult>(
          (accSeries, d, dataIndex) => {
            if (filter && !filter(d, dataIndex)) {
              return accSeries;
            }
            return mergeMinMax(accSeries, [d.y, d.y]);
          },
          [Infinity, -Infinity],
        );
        return mergeMinMax(acc, seriesMinMax);
      },
      [Infinity, -Infinity],
    );
};
