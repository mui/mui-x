import { createSelector } from '../../utils/selectors';
import { CartesianAxisItemIdentifier, ChartsAxisProps } from '../../../../models/axis';
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

const selectValue =
  (direction: 'x' | 'y') => (value: CartesianAxisItemIdentifier | null | undefined) => {
    if (value === undefined) {
      // Undefined means not controlled
      return undefined;
    }
    return value?.direction === direction ? value : null;
  };

export const selectorChartsControlledXAxisHighlight = createSelector(
  [selectorChartControlledCartesianAxisHighlight],
  selectValue('x'),
);

export const selectorChartsControlledYAxisHighlight = createSelector(
  [selectorChartControlledCartesianAxisHighlight],
  selectValue('y'),
);

export const selectorChartsHighlightXAxisIndex = createSelector(
  [selectorChartsInteractionXAxisIndex, selectorChartsControlledXAxisHighlight],
  (computedIndex, controlledItem) =>
    controlledItem !== undefined ? (controlledItem?.dataIndex ?? null) : computedIndex,
);

export const selectorChartsHighlightYAxisIndex = createSelector(
  [selectorChartsInteractionYAxisIndex, selectorChartsControlledYAxisHighlight],
  (computedIndex, controlledItem) =>
    controlledItem !== undefined ? (controlledItem?.dataIndex ?? null) : computedIndex,
);

export const selectorChartsHighlightXAxisValue = createSelector(
  [selectorChartsInteractionXAxisValue, selectorChartsControlledXAxisHighlight, selectorChartXAxis],
  (computedValue, controlledItem, axis) => {
    if (controlledItem === undefined) {
      return computedValue;
    }

    if (controlledItem === null) {
      return null;
    }
    if (controlledItem.dataIndex !== null) {
      return axis.axis[controlledItem.axisId].data?.[controlledItem.dataIndex];
    }
    return null;
  },
);

export const selectorChartsHighlightYAxisValue = createSelector(
  [selectorChartsInteractionYAxisValue, selectorChartsControlledYAxisHighlight, selectorChartYAxis],
  (computedValue, controlledItem, axis) => {
    if (controlledItem === undefined) {
      return computedValue;
    }

    if (controlledItem === null) {
      return null;
    }
    if (controlledItem.dataIndex !== null) {
      return axis.axis[controlledItem.axisId].data?.[controlledItem.dataIndex];
    }
    return null;
  },
);

/**
 * Get the scale of the axis with highlight if controlled. The default axis otherwise.
 * @param controlledItem The controlled value of highlightedAxis
 * @param axis The axis stats after all the processing
 * @returns axis scale
 */
const selectScale = (
  controlledItem: CartesianAxisItemIdentifier | null | undefined,
  axis: ComputeResult<ChartsAxisProps>,
) => {
  if (controlledItem === undefined) {
    return axis.axis[axis.axisIds[0]].scale;
  }
  if (controlledItem !== null) {
    return axis.axis[controlledItem.axisId]?.scale;
  }
  return axis.axis[axis.axisIds[0]].scale;
};

export const selectorChartsHighlightXAxisScale = createSelector(
  [selectorChartsControlledXAxisHighlight, selectorChartXAxis],
  selectScale,
);

export const selectorChartsHighlightYAxisScale = createSelector(
  [selectorChartsControlledYAxisHighlight, selectorChartYAxis],
  selectScale,
);
