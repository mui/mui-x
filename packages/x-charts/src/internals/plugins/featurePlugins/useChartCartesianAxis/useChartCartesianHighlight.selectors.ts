import { createSelector } from '../../utils/selectors';
import { AxisId, ChartsAxisProps } from '../../../../models/axis';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';

import {
  selectorChartsInteractionXAxisIndex,
  selectorChartsInteractionXAxisValue,
  selectorChartsInteractionYAxisIndex,
  selectorChartsInteractionYAxisValue,
} from './useChartCartesianInteraction.selectors';
import { ChartState } from '../../models/chart';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { ComputeResult } from './computeAxisValue';

const selectorChartControlledCartesianAxisHighlight = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.controlledCartesianAxisHighlight;

export const selectorChartsControlledIndex = createSelector(
  [selectorChartControlledCartesianAxisHighlight],
  (value) => {
    if (value == null) {
      return value;
    }
    return value.dataIndex;
  },
);

export const selectorChartsControlledId = createSelector(
  [selectorChartControlledCartesianAxisHighlight],
  (value) => {
    if (value == null) {
      return value;
    }
    return value.axisId;
  },
);

export const selectorChartsHighlightXAxisIndex = createSelector(
  [selectorChartsInteractionXAxisIndex, selectorChartsControlledIndex],
  (computedIndex, controlledIndex) =>
    controlledIndex !== undefined ? controlledIndex : computedIndex,
);

export const selectorChartsHighlightYAxisIndex = createSelector(
  [selectorChartsInteractionYAxisIndex, selectorChartsControlledIndex],
  (computedIndex, controlledIndex) =>
    controlledIndex !== undefined ? controlledIndex : computedIndex,
);

export const selectorChartsHighlightXAxisValue = createSelector(
  [
    selectorChartsInteractionXAxisValue,
    selectorChartsControlledId,
    selectorChartsControlledIndex,
    selectorChartXAxis,
  ],
  (computedValue, controlledId, controlledIndex, axis) => {
    if (controlledId === undefined) {
      return computedValue;
    }

    if (controlledId === null || controlledIndex == null) {
      return null;
    }

    if (axis.axis[controlledId]?.data === undefined) {
      // The controlled id does not correspond to an x-axis.
      // Or it has no data associated.
      return null;
    }
    return axis.axis[controlledId].data[controlledIndex];
  },
);

export const selectorChartsHighlightYAxisValue = createSelector(
  [
    selectorChartsInteractionYAxisValue,
    selectorChartsControlledId,
    selectorChartsControlledIndex,
    selectorChartYAxis,
  ],
  (computedValue, controlledId, controlledIndex, axis) => {
    if (controlledId === undefined) {
      return computedValue;
    }

    if (controlledId === null || controlledIndex == null) {
      return null;
    }

    if (axis.axis[controlledId]?.data === undefined) {
      // The controlled id does not correspond to an x-axis.
      // Or it has no data associated.
      return null;
    }
    return axis.axis[controlledId].data[controlledIndex];
  },
);

/**
 * Get the scale of the axis with highlight if controlled. The default axis otherwise.
 * @param controlledItem The controlled value of highlightedAxis
 * @param axis The axis state after all the processing
 * @returns axis state
 */
const selectAxis = (axisId: AxisId | null | undefined, axis: ComputeResult<ChartsAxisProps>) => {
  if (axisId === undefined) {
    return axis.axis[axis.axisIds[0]];
  }
  if (axisId !== null) {
    return axis.axis[axisId];
  }
  return null;
};

export const selectorChartsHighlightXAxis = createSelector(
  [selectorChartsControlledId, selectorChartXAxis],
  selectAxis,
);

export const selectorChartsHighlightYAxis = createSelector(
  [selectorChartsControlledId, selectorChartYAxis],
  selectAxis,
);
