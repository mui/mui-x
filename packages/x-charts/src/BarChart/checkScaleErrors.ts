import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { AxisDefaultized, isBandScaleConfig, isPointScaleConfig } from '../models/axis';
import { SeriesId } from '../models/seriesType/common';

const getXOrY = (isVertical: boolean, isContinuous: boolean, x: string, y: string) => {
  if (isVertical) {
    return isContinuous ? y : x;
  }
  return isContinuous ? x : y;
};

const getAxisMessage = (isVertical: boolean, axisKey: string, isContinuous: boolean = false) => {
  const axisName = getXOrY(isVertical, isContinuous, 'x-axis', 'y-axis');
  const axisKeyName = getXOrY(isVertical, isContinuous, 'xAxis', 'yAxis');
  const axisDefaultKey = getXOrY(isVertical, isContinuous, DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY);

  return axisKey === axisDefaultKey
    ? `The first \`${axisKeyName}\``
    : `The ${axisName} with id "${axisKey}"`;
};

export function checkScaleErrors(
  verticalLayout: boolean,
  seriesId: SeriesId,
  xAxisKey: string,
  xAxis: { DEFAULT_X_AXIS_KEY: AxisDefaultized } & { [axisKey: string]: AxisDefaultized },
  yAxisKey: string,
  yAxis: { DEFAULT_X_AXIS_KEY: AxisDefaultized } & { [axisKey: string]: AxisDefaultized },
): void {
  const xAxisConfig = xAxis[xAxisKey];
  const yAxisConfig = yAxis[yAxisKey];

  const discreteAxisConfig = verticalLayout ? xAxisConfig : yAxisConfig;
  const continuousAxisConfig = verticalLayout ? yAxisConfig : xAxisConfig;

  const discreteAxisKey = verticalLayout ? xAxisKey : yAxisKey;
  const continuousAxisKey = verticalLayout ? yAxisKey : xAxisKey;

  if (!isBandScaleConfig(discreteAxisConfig)) {
    throw new Error(
      `MUI X Charts: ${getAxisMessage(verticalLayout, discreteAxisKey)} should be of type "band" to display the bar series of id "${seriesId}".`,
    );
  }
  if (discreteAxisConfig.data === undefined) {
    throw new Error(
      `MUI X Charts: ${getAxisMessage(verticalLayout, discreteAxisKey)} should have data property.`,
    );
  }
  if (isBandScaleConfig(continuousAxisConfig) || isPointScaleConfig(continuousAxisConfig)) {
    throw new Error(
      `MUI X Charts: ${getAxisMessage(verticalLayout, continuousAxisKey, true)} should be a continuous type to display the bar series of id "${seriesId}".`,
    );
  }
}
