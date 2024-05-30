import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { AxisDefaultized, isBandScaleConfig, isPointScaleConfig } from '../models/axis';
import { SeriesId } from '../models/seriesType/common';

const getAxisMessage = (axisDirection: 'x' | 'y', axisKey: string) => {
  const axisName = `${axisDirection}-axis`;
  const axisKeyName = `${axisDirection}Axis`;
  const axisDefaultKey = axisDirection === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY;
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

  const discreteAxisDirection = verticalLayout ? 'x' : 'y';
  const continuousAxisDirection = verticalLayout ? 'y' : 'x';

  if (!isBandScaleConfig(discreteAxisConfig)) {
    throw new Error(
      `MUI X Charts: ${getAxisMessage(discreteAxisDirection, discreteAxisKey)} should be of type "band" to display the bar series of id "${seriesId}".`,
    );
  }
  if (discreteAxisConfig.data === undefined) {
    throw new Error(
      `MUI X Charts: ${getAxisMessage(discreteAxisDirection, discreteAxisKey)} should have data property.`,
    );
  }
  if (isBandScaleConfig(continuousAxisConfig) || isPointScaleConfig(continuousAxisConfig)) {
    throw new Error(
      `MUI X Charts: ${getAxisMessage(continuousAxisDirection, continuousAxisKey)} should be a continuous type to display the bar series of id "${seriesId}".`,
    );
  }
}
