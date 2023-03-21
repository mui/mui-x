import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../const';

function defaultizeCartesianSeries(series: any) {
  const defualtizedSeries: any = {};
  Object.keys(series).forEach((seriesId) => {
    defualtizedSeries[seriesId] = {
      xAxisKey: DEFAULT_X_AXIS_KEY,
      yAxisKey: DEFAULT_Y_AXIS_KEY,
      ...series[seriesId],
    };
  });
  return defualtizedSeries;
}

export default defaultizeCartesianSeries;
