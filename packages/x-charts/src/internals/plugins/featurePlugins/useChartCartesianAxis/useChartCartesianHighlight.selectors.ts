import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type AxisItemIdentifier, type ChartsAxisProps } from '../../../../models/axis';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';
import {
  selectorChartsInteractionXAxisIndex,
  selectorChartsInteractionXAxisValue,
  selectorChartsInteractionYAxisIndex,
  selectorChartsInteractionYAxisValue,
} from './useChartCartesianInteraction.selectors';
import { type ChartState } from '../../models/chart';
import { type UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { type ComputeResult } from './computeAxisValue';
import {
  selectorChartsKeyboardXAxisIndex,
  selectorChartsKeyboardYAxisIndex,
} from '../useChartKeyboardNavigation/useChartKeyboardNavigation.selectors';
import { selectorChartsLastInteraction } from '../useChartInteraction/useChartInteraction.selectors';
import { type InteractionUpdateSource } from '../useChartInteraction/useChartInteraction.types';
import { selectorBrushShouldPreventAxisHighlight } from '../useChartBrush';

function getAxisHighlight(lastInteractionUpdate: InteractionUpdateSource | undefined, pointerHighlight: AxisItemIdentifier | false, keyboardHighlight: AxisItemIdentifier | false) {
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

  return []

}
const selectorChartControlledCartesianAxisHighlight = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.controlledCartesianAxisHighlight;

const selectAxisHighlight = (
  computedIndex: number | null,
  axis: ComputeResult<ChartsAxisProps>,
  controlledAxisItems: AxisItemIdentifier[] | undefined,
  keyboardAxisItem: AxisItemIdentifier | undefined,
  lastInteractionUpdate: InteractionUpdateSource | undefined,
  isBrushSelectionActive: boolean | undefined,
) => {
  if (isBrushSelectionActive) {
    return [];
  }

  if (controlledAxisItems !== undefined) {
    return controlledAxisItems.filter((item) => axis.axis[item.axisId] !== undefined).map((item) => item);
  }

  const pointerHighlight = computedIndex !== null && {
    axisId: axis.axisIds[0],
    dataIndex: computedIndex,
  };
  const keyboardHighlight = keyboardAxisItem != null && keyboardAxisItem;

  return getAxisHighlight(lastInteractionUpdate, pointerHighlight, keyboardHighlight);
}

export const selectorChartsHighlightXAxisIndex = createSelectorMemoized(
  selectorChartsInteractionXAxisIndex,
  selectorChartXAxis,
  selectorChartControlledCartesianAxisHighlight,
  selectorChartsKeyboardXAxisIndex,
  selectorChartsLastInteraction,
  selectorBrushShouldPreventAxisHighlight,

  selectAxisHighlight,
);

export const selectorChartsHighlightYAxisIndex = createSelectorMemoized(
  selectorChartsInteractionYAxisIndex,
  selectorChartYAxis,
  selectorChartControlledCartesianAxisHighlight,
  selectorChartsKeyboardYAxisIndex,
  selectorChartsLastInteraction,
  selectorBrushShouldPreventAxisHighlight,
  selectAxisHighlight,
);

const selectAxisHighlightWithValue = (
  computedIndex: number | null,
  computedValue: number | Date | null,
  axis: ComputeResult<ChartsAxisProps>,
  controlledAxisItems: AxisItemIdentifier[] | undefined,
  keyboardAxisItem: AxisItemIdentifier | undefined,
  lastInteractionUpdate: InteractionUpdateSource | undefined,
  isBrushSelectionActive: boolean | undefined,
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

  const pointerHighlight = computedValue != null && computedIndex != null && {
    axisId: axis.axisIds[0],
    dataIndex: computedIndex,
    value: computedValue,
  };
  const keyboardValue =
    keyboardAxisItem != null && axis.axis[keyboardAxisItem.axisId]?.data?.[keyboardAxisItem.dataIndex];
  const keyboardHighlight = keyboardAxisItem != null &&
    keyboardValue != null && { ...keyboardAxisItem, value: keyboardValue };

  return getAxisHighlight(lastInteractionUpdate, pointerHighlight, keyboardHighlight);
};

export const selectorChartsHighlightXAxisValue = createSelectorMemoized(
  selectorChartsInteractionXAxisIndex,
  selectorChartsInteractionXAxisValue,
  selectorChartXAxis,
  selectorChartControlledCartesianAxisHighlight,
  selectorChartsKeyboardXAxisIndex,
  selectorChartsLastInteraction,
  selectorBrushShouldPreventAxisHighlight,

  selectAxisHighlightWithValue,
);

export const selectorChartsHighlightYAxisValue = createSelectorMemoized(
  selectorChartsInteractionYAxisIndex,
  selectorChartsInteractionYAxisValue,
  selectorChartYAxis,
  selectorChartControlledCartesianAxisHighlight,
  selectorChartsKeyboardYAxisIndex,
  selectorChartsLastInteraction,
  selectorBrushShouldPreventAxisHighlight,

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
  selectorChartControlledCartesianAxisHighlight,
  selectorChartXAxis,
  selectAxis,
);

export const selectorChartsHighlightYAxis = createSelector(
  selectorChartControlledCartesianAxisHighlight,
  selectorChartYAxis,
  selectAxis,
);
