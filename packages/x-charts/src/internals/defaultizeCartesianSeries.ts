import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';

function defaultizeCartesianSeries(series: any) {
  const defaultizedSeries: any = {};
  Object.keys(series).forEach((seriesId) => {
    defaultizedSeries[seriesId] = {
      xAxisKey: DEFAULT_X_AXIS_KEY,
      yAxisKey: DEFAULT_Y_AXIS_KEY,
      ...series[seriesId],
    };
  });
  return defaultizedSeries;
}

export default defaultizeCartesianSeries;
