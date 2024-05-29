import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { AxisDefaultized, isBandScaleConfig, isPointScaleConfig } from '../models/axis';
import { SeriesId } from '../models/seriesType/common';

export function checkScale(
  verticalLayout: boolean,
  seriesId: SeriesId,
  xAxisKey: string,
  xAxis: { DEFAULT_X_AXIS_KEY: AxisDefaultized } & { [axisKey: string]: AxisDefaultized },
  yAxisKey: string,
  yAxis: { DEFAULT_X_AXIS_KEY: AxisDefaultized } & { [axisKey: string]: AxisDefaultized },
): void {
  const xAxisConfig = xAxis[xAxisKey];
  const yAxisConfig = yAxis[yAxisKey];

  if (verticalLayout) {
    if (!isBandScaleConfig(xAxisConfig)) {
      throw new Error(
        `MUI X Charts: ${
          xAxisKey === DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisKey}"`
        } should be of type "band" to display the bar series of id "${seriesId}".`,
      );
    }
    if (xAxis[xAxisKey].data === undefined) {
      throw new Error(
        `MUI X Charts: ${
          xAxisKey === DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisKey}"`
        } should have data property.`,
      );
    }
    if (isBandScaleConfig(yAxisConfig) || isPointScaleConfig(yAxisConfig)) {
      throw new Error(
        `MUI X Charts: ${
          yAxisKey === DEFAULT_Y_AXIS_KEY ? 'The first `yAxis`' : `The y-axis with id "${yAxisKey}"`
        } should be a continuous type to display the bar series of id "${seriesId}".`,
      );
    }
  } else {
    if (!isBandScaleConfig(yAxisConfig)) {
      throw new Error(
        `MUI X Charts: ${
          yAxisKey === DEFAULT_Y_AXIS_KEY ? 'The first `yAxis`' : `The y-axis with id "${yAxisKey}"`
        } should be of type "band" to display the bar series of id "${seriesId}".`,
      );
    }

    if (yAxis[yAxisKey].data === undefined) {
      throw new Error(
        `MUI X Charts: ${
          yAxisKey === DEFAULT_Y_AXIS_KEY ? 'The first `yAxis`' : `The y-axis with id "${yAxisKey}"`
        } should have data property.`,
      );
    }
    if (isBandScaleConfig(xAxisConfig) || isPointScaleConfig(xAxisConfig)) {
      throw new Error(
        `MUI X Charts: ${
          xAxisKey === DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisKey}"`
        } should be a continuous type to display the bar series of id "${seriesId}".`,
      );
    }
  }
}
