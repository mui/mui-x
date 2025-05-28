import { createSelector } from '../../utils/selectors';
import { CartesianAxisItemIdentifier } from '../../../../models/axis';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';

import {
  selectorChartsInteractionXAxisIndex,
  selectorChartsInteractionXAxisValue,
  selectorChartsInteractionYAxisIndex,
  selectorChartsInteractionYAxisValue,
} from './useChartCartesianInteraction.selectors';
import { ChartState } from '../../models/chart';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';

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
