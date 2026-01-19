import { useThemeProps } from '@mui/material/styles';
import { useDrawingArea } from './useDrawingArea';
import { useXAxes, useYAxes } from './useAxis';
import { defaultProps } from '../ChartsXAxis/utilities';
import { type AxisId } from '../models/axis';

export interface AxisPosition {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Get the position of the given X axis.
 * @param axisId The id of the X axis.
 * @returns {AxisPosition | null} The position of the X axis or null if the axis does not exist.
 */
export function useXAxisPosition(axisId: AxisId): AxisPosition | null {
  const { xAxis: xAxes } = useXAxes();
  const drawingArea = useDrawingArea();
  const axis = xAxes[axisId];

  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: axis, name: 'MuiChartsXAxis' });

  if (!axis) {
    return null;
  }

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const { position, offset, height: axisHeight } = defaultizedProps;

  let top;

  if (position === 'bottom') {
    top = drawingArea.top + drawingArea.height + offset;
  } else {
    top = drawingArea.top - axisHeight - offset;
  }

  const left = drawingArea.left;
  const bottom = top + axisHeight;
  const right = drawingArea.left + drawingArea.width;

  return {
    left,
    top,
    right,
    bottom,
  };
}

/**
 * Get the position of the given Y axis.
 * @param axisId The id of the Y axis.
 * @returns {AxisPosition | null} The position of the Y axis or null if the axis does not exist.
 */
export function useYAxisPosition(axisId: AxisId): AxisPosition | null {
  const { yAxis: yAxes } = useYAxes();
  const drawingArea = useDrawingArea();
  const axis = yAxes[axisId];

  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: axis, name: 'MuiChartsYAxis' });

  if (!axis) {
    return null;
  }

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const { position, offset, width: axisWidth } = defaultizedProps;

  let left;

  if (position === 'right') {
    left = drawingArea.left + drawingArea.width + offset;
  } else {
    left = drawingArea.left - axisWidth - offset;
  }

  const top = drawingArea.top;
  const bottom = drawingArea.top + drawingArea.height;
  const right = left + axisWidth;

  return {
    left,
    top,
    right,
    bottom,
  };
}
