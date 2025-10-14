import { createSelector } from '../../utils/selectors';
import { AxisItemIdentifier, ChartsAxisProps } from '../../../../models/axis';
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
import {
  selectorChartsKeyboardXAxisIndex,
  selectorChartsKeyboardYAxisIndex,
} from '../useChartKeyboardNavigation/useChartKeyboardNavigation.selectors';
import { selectorChartsLastInteraction } from '../useChartInteraction/useChartInteraction.selectors';
import { InteractionUpdateSource } from '../useChartInteraction/useChartInteraction.types';
import { selectorBrushShouldPreventAxisHighlight } from '../useChartBrush';

const selectorChartControlledCartesianAxisHighlight = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.controlledCartesianAxisHighlight;

const selectAxisHighlight = (
  computedIndex: number | null,
  axis: ComputeResult<ChartsAxisProps>,
  axisItems: AxisItemIdentifier[] | undefined,
  isBrushSelectionActive: boolean,
) => {
  if (isBrushSelectionActive) {
    return [];
  }

  if (axisItems !== undefined) {
    return axisItems.filter((item) => axis.axis[item.axisId] !== undefined).map((item) => item);
  }
  return computedIndex === null ? [] : [{ axisId: axis.axisIds[0], dataIndex: computedIndex }];
};

export const selectorChartsHighlightXAxisIndex = createSelector(
  [
    selectorChartsInteractionXAxisIndex,
    selectorChartXAxis,
    selectorChartControlledCartesianAxisHighlight,
    selectorBrushShouldPreventAxisHighlight,
  ],
  selectAxisHighlight,
);

export const selectorChartsHighlightYAxisIndex = createSelector(
  [
    selectorChartsInteractionYAxisIndex,
    selectorChartYAxis,
    selectorChartControlledCartesianAxisHighlight,
    selectorBrushShouldPreventAxisHighlight,
  ],
  selectAxisHighlight,
);

const selectAxisHighlightWithValue = (
  computedIndex: number | null,
  computedValue: number | Date | null,
  axis: ComputeResult<ChartsAxisProps>,
  controlledAxisItems: AxisItemIdentifier[] | undefined,
  keyboardAxisItem: AxisItemIdentifier | undefined,
  lastInteractionUpdate: InteractionUpdateSource | undefined,
  isBrushSelectionActive: boolean,
) => {
  if (isBrushSelectionActive) {
    return [];
  }

  if (controlledAxisItems !== undefined) {
    return controlledAxisItems
      .map((item) => ({
        ...item,
        value: axis.axis[item.axisId]?.data?.[item.dataIndex],
      }))
      .filter(({ value }) => value !== undefined);
  }

  const pointerHighlight = computedValue !== null && {
    axisId: axis.axisIds[0],
    dataIndex: computedIndex,
    value: computedValue,
  };
  const keyboardValue =
    keyboardAxisItem && axis.axis[keyboardAxisItem.axisId]?.data?.[keyboardAxisItem.dataIndex];
  const keyboardHighlight = keyboardAxisItem &&
    keyboardValue != null && { ...keyboardAxisItem, value: keyboardValue };

  if (lastInteractionUpdate === 'pointer') {
    if (pointerHighlight) {
      return [pointerHighlight];
    }
    if (keyboardHighlight) {
      return [keyboardHighlight];
    }
  }

  if (lastInteractionUpdate === 'keyboard') {
    if (keyboardHighlight) {
      return [keyboardHighlight];
    }
    if (pointerHighlight) {
      return [pointerHighlight];
    }
  }

  return [];
};

export const selectorChartsHighlightXAxisValue = createSelector(
  [
    selectorChartsInteractionXAxisIndex,
    selectorChartsInteractionXAxisValue,
    selectorChartXAxis,
    selectorChartControlledCartesianAxisHighlight,
    selectorChartsKeyboardXAxisIndex,
    selectorChartsLastInteraction,
    selectorBrushShouldPreventAxisHighlight,
  ],
  selectAxisHighlightWithValue,
);

export const selectorChartsHighlightYAxisValue = createSelector(
  [
    selectorChartsInteractionYAxisIndex,
    selectorChartsInteractionYAxisValue,
    selectorChartYAxis,
    selectorChartControlledCartesianAxisHighlight,
    selectorChartsKeyboardYAxisIndex,
    selectorChartsLastInteraction,
    selectorBrushShouldPreventAxisHighlight,
  ],
  selectAxisHighlightWithValue,
);

/**
 * Get the scale of the axis with highlight if controlled. The default axis otherwise.
 * @param controlledItem The controlled value of highlightedAxis
 * @param axis The axis state after all the processing
 * @returns axis state
 */
const selectAxis = (
  axisItems: AxisItemIdentifier[] | undefined,
  axis: ComputeResult<ChartsAxisProps>,
) => {
  if (axisItems === undefined) {
    return [axis.axis[axis.axisIds[0]]];
  }
  const filteredAxes = axisItems
    .map((item) => axis.axis[item.axisId] ?? null)
    .filter((item) => item !== null);

  return filteredAxes;
};

export const selectorChartsHighlightXAxis = createSelector(
  [selectorChartControlledCartesianAxisHighlight, selectorChartXAxis],
  selectAxis,
);

export const selectorChartsHighlightYAxis = createSelector(
  [selectorChartControlledCartesianAxisHighlight, selectorChartYAxis],
  selectAxis,
);
