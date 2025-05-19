import { createSelector } from '../../utils/selectors';
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

export const selectorChartsControlledXAxisHighlight = createSelector(
  [selectorChartControlledCartesianAxisHighlight],
  (controlledValues) => controlledValues?.x,
);
export const selectorChartsControlledYAxisHighlight = createSelector(
  [selectorChartControlledCartesianAxisHighlight],
  (controlledValues) => controlledValues?.y,
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
    return controlledItem.value;
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
    return controlledItem.value;
  },
);
