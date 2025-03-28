import { createSelector } from '../../utils/selectors';
import {
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
} from '../useChartInteraction/useChartInteraction.selectors';
import { getAxisIndex, getAxisValue } from './getAxisValue';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';

export const selectorChartsInteractionXAxisIndex = createSelector(
  [selectorChartsInteractionPointerX, selectorChartXAxis],
  (x, xAxes) => {
    if (x === null || !xAxes.axis[xAxes.axisIds[0]]) {
      return null;
    }
    return getAxisIndex(xAxes.axis[xAxes.axisIds[0]], x);
  },
);

export const selectorChartsInteractionXAxisValue = createSelector(
  [selectorChartsInteractionPointerX, selectorChartXAxis, selectorChartsInteractionXAxisIndex],
  (x, xAxes, xIndex) => {
    if (x === null || xIndex === null || !xAxes.axis[xAxes.axisIds[0]]) {
      return null;
    }
    return getAxisValue(xAxes.axis[xAxes.axisIds[0]], x, xIndex);
  },
);

export const selectorChartsInteractionYAxisIndex = createSelector(
  [selectorChartsInteractionPointerY, selectorChartYAxis],
  (y, yAxes) => {
    if (y === null || !yAxes.axis[yAxes.axisIds[0]]) {
      return null;
    }
    return getAxisIndex(yAxes.axis[yAxes.axisIds[0]], y);
  },
);

export const selectorChartsInteractionYAxisValue = createSelector(
  [selectorChartsInteractionPointerY, selectorChartYAxis, selectorChartsInteractionYAxisIndex],
  (y, yAxes, yIndex) => {
    if (y === null || yIndex === null || !yAxes.axis[yAxes.axisIds[0]]) {
      return null;
    }
    return getAxisValue(yAxes.axis[yAxes.axisIds[0]], y, yIndex);
  },
);

export type AxisValueIdentifier = {
  value: number | Date | string;
  // Set to -1 if no index.
  index: number;
};

// TODO: probably remove in favor of the two more specific.
export const selectorChartsInteractionXAxis = createSelector(
  [selectorChartsInteractionXAxisIndex, selectorChartsInteractionXAxisValue],
  (index, value): AxisValueIdentifier | null =>
    index === null || value === null ? null : { index, value },
);

export const selectorChartsInteractionYAxis = createSelector(
  [selectorChartsInteractionYAxisIndex, selectorChartsInteractionYAxisValue],
  (index, value): AxisValueIdentifier | null =>
    index === null || value === null ? null : { index, value },
);

// TODO: probably remove in favor of the two more specific.
export const selectorChartsInteractionXAxisIsDefined = createSelector(
  [selectorChartsInteractionXAxisIndex],
  (index) => index !== null && index >= 0,
);

export const selectorChartsInteractionYAxisIsDefined = createSelector(
  [selectorChartsInteractionYAxisIndex],
  (index) => index !== null && index >= 0,
);
