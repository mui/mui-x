import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { AxisDefaultized, AxisId, isBandScaleConfig, isPointScaleConfig } from '../models/axis';
import { SeriesId } from '../models/seriesType/common';

const getAxisMessage = (axisDirection: 'x' | 'y', axisId: AxisId) => {
  const axisName = `${axisDirection}-axis`;
  const axisIdName = `${axisDirection}Axis`;
  const axisDefaultKey = axisDirection === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY;
  return axisId === axisDefaultKey
    ? `The first \`${axisIdName}\``
    : `The ${axisName} with id "${axisId}"`;
};

export function checkScaleErrors(
  verticalLayout: boolean,
  seriesId: SeriesId,
  xAxisId: AxisId,
  xAxis: { [axisId: AxisId]: AxisDefaultized },
  yAxisId: AxisId,
  yAxis: { [axisId: AxisId]: AxisDefaultized },
): void {
  const xAxisConfig = xAxis[xAxisId];
  const yAxisConfig = yAxis[yAxisId];

  const discreteAxisConfig = verticalLayout ? xAxisConfig : yAxisConfig;
  const continuousAxisConfig = verticalLayout ? yAxisConfig : xAxisConfig;

  const discreteAxisId = verticalLayout ? xAxisId : yAxisId;
  const continuousAxisId = verticalLayout ? yAxisId : xAxisId;

  const discreteAxisDirection = verticalLayout ? 'x' : 'y';
  const continuousAxisDirection = verticalLayout ? 'y' : 'x';

  if (!isBandScaleConfig(discreteAxisConfig)) {
    throw new Error(
      `MUI X: ${getAxisMessage(discreteAxisDirection, discreteAxisId)} should be of type "band" to display the bar series of id "${seriesId}".`,
    );
  }
  if (discreteAxisConfig.data === undefined) {
    throw new Error(
      `MUI X: ${getAxisMessage(discreteAxisDirection, discreteAxisId)} should have data property.`,
    );
  }
  if (isBandScaleConfig(continuousAxisConfig) || isPointScaleConfig(continuousAxisConfig)) {
    throw new Error(
      `MUI X: ${getAxisMessage(continuousAxisDirection, continuousAxisId)} should be a continuous type to display the bar series of id "${seriesId}".`,
    );
  }
}
