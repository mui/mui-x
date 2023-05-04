import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';

function defaultizeCartesianSeries<ISeries extends {}>(series: {
  [id: string]: ISeries;
}): {
  [id: string]: ISeries & {
    xAxisKey: string;
    yAxisKey: string;
  };
} {
  const defaultizedSeries: {
    [id: string]: ISeries & {
      xAxisKey: string;
      yAxisKey: string;
    };
  } = {};
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
