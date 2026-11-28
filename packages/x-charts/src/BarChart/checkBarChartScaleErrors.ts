import { errorOnce, warnOnce } from '@mui/x-internals/warning';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import type { AxisId, ComputedXAxis, ComputedYAxis } from '../models/axis';
import type { SeriesId } from '../models/seriesType/common';
import type { BarSeriesType } from '../models/seriesType/bar';

const getAxisMessage = (axisDirection: 'x' | 'y', axisId: AxisId) => {
  const axisName = `${axisDirection}-axis`;
  const axisIdName = `${axisDirection}Axis`;
  const axisDefaultKey = axisDirection === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY;
  return axisId === axisDefaultKey
    ? `The first \`${axisIdName}\``
    : `The ${axisName} with id "${axisId}"`;
};

export function checkBarChartScaleErrors(
  verticalLayout: boolean,
  seriesId: SeriesId,
  seriesDataLength: number,
  xAxisId: AxisId,
  xAxis: { [axisId: AxisId]: Pick<ComputedXAxis, 'scaleType' | 'data'> },
  yAxisId: AxisId,
  yAxis: { [axisId: AxisId]: Pick<ComputedYAxis, 'scaleType' | 'data'> },
  /**
   * If provided, checks that the bars can start from `baseline` on the value axis.
   */
  options?: { baseline: BarSeriesType['baseline'] },
): void {
  const xAxisConfig = xAxis[xAxisId];
  const yAxisConfig = yAxis[yAxisId];

  const discreteAxisConfig = verticalLayout ? xAxisConfig : yAxisConfig;
  const continuousAxisConfig = verticalLayout ? yAxisConfig : xAxisConfig;

  const discreteAxisId = verticalLayout ? xAxisId : yAxisId;
  const continuousAxisId = verticalLayout ? yAxisId : xAxisId;

  const discreteAxisDirection = verticalLayout ? 'x' : 'y';
  const continuousAxisDirection = verticalLayout ? 'y' : 'x';

  if (discreteAxisConfig.scaleType !== 'band') {
    throw new Error(
      `MUI X Charts: ${getAxisMessage(discreteAxisDirection, discreteAxisId)} should be of type "band" to display the bar series of id "${seriesId}". ` +
        'Bar charts require a band scale for the category axis to properly position and size the bars. ' +
        'Set the scaleType to "band" for this axis.',
    );
  }
  if (discreteAxisConfig.data === undefined) {
    throw new Error(
      `MUI X Charts: ${getAxisMessage(discreteAxisDirection, discreteAxisId)} should have a data property. ` +
        'The axis needs data to define the categories for the bar chart. ' +
        'Provide a data array to the axis configuration.',
    );
  }
  if (continuousAxisConfig.scaleType === 'band' || continuousAxisConfig.scaleType === 'point') {
    throw new Error(
      `MUI X Charts: ${getAxisMessage(continuousAxisDirection, continuousAxisId)} should be a continuous type to display the bar series of id "${seriesId}". ` +
        'Bar charts require a continuous scale (like "linear" or "log") for the value axis. ' +
        'Change the scaleType to a continuous type such as "linear".',
    );
  }
  if (process.env.NODE_ENV !== 'production') {
    if (discreteAxisConfig.data.length < seriesDataLength) {
      errorOnce(
        [
          `MUI X Charts: ${getAxisMessage(discreteAxisDirection, discreteAxisId)} has less data (${discreteAxisConfig.data.length} values) than the bar series of id "${seriesId}" (${seriesDataLength} values).`,
          'The axis data should have at least the same length than the series using it.',
        ].join('\n'),
      );
    }

    const baseline = options?.baseline ?? 0;
    if (
      options &&
      continuousAxisConfig.scaleType === 'log' &&
      typeof baseline === 'number' &&
      baseline <= 0
    ) {
      warnOnce(
        [
          `MUI X Charts: ${getAxisMessage(continuousAxisDirection, continuousAxisId)} uses a log scale, but the bar series of id "${seriesId}" starts its bars from ${baseline}.`,
          'The logarithm of a value lower than or equal to 0 is undefined, so these bars are not rendered.',
          "Set `baseline: 'min'` on the series to start the bars from the axis minimum.",
        ].join('\n'),
      );
    }
  }
}
