import { useThemeProps } from '@mui/material/styles';
import { type ChartDrawingArea, useDrawingArea } from './useDrawingArea';
import { useXAxes, useYAxes } from './useAxis';
import { defaultProps } from '../ChartsXAxis/utilities';
import { type AxisId, type ComputedXAxis, type ComputedYAxis } from '../models/axis';

export interface AxisCoordinates {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export function getXAxisCoordinates(
  drawingArea: ChartDrawingArea,
  computedAxis: { position?: ComputedXAxis['position']; offset: number; height: number },
): AxisCoordinates | null {
  const { position, offset, height: axisHeight } = computedAxis;

  if (position === 'none') {
    return null;
  }

  let top;

  if (position === 'top') {
    top = drawingArea.top - axisHeight - offset;
  } else {
    top = drawingArea.top + drawingArea.height + offset;
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
 * Get the coordinates of the given X axis. The coordinates are relative to the SVG's origin.
 * @param axisId The id of the X axis.
 * @returns {AxisCoordinates | null} The coordinates of the X axis or null if the axis does not exist or has position: 'none'.
 */
export function useXAxisCoordinates(axisId: AxisId): AxisCoordinates | null {
  const { xAxis: xAxes } = useXAxes();
  const drawingArea = useDrawingArea();
  const axis = xAxes[axisId];

  // FIXME(v9): Remove
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: axis, name: 'MuiChartsXAxis' });

  if (!axis) {
    return null;
  }

  const defaultizedProps = { ...defaultProps, ...themedProps };

  return getXAxisCoordinates(drawingArea, defaultizedProps);
}

export function getYAxisCoordinates(
  drawingArea: ChartDrawingArea,
  computedAxis: { position?: ComputedYAxis['position']; offset: number; width: number },
): AxisCoordinates | null {
  const { position, offset, width: axisWidth } = computedAxis;

  if (position === 'none') {
    return null;
  }

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

/**
 * Returns the coordinates of the given Y axis. The coordinates are relative to the SVG's origin.
 * @param axisId The id of the Y axis.
 * @returns {AxisCoordinates | null} The coordinates of the Y axis or null if the axis does not exist or has position: 'none'.
 */
export function useYAxisCoordinates(axisId: AxisId): AxisCoordinates | null {
  const { yAxis: yAxes } = useYAxes();
  const drawingArea = useDrawingArea();
  const axis = yAxes[axisId];

  // FIXME(v9): Remove
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: axis, name: 'MuiChartsYAxis' });

  if (!axis) {
    return null;
  }

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  return getYAxisCoordinates(drawingArea, defaultizedProps);
}
