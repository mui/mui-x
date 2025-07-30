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

const selectorChartControlledCartesianAxisHighlight = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.controlledCartesianAxisHighlight;

const selectAxisHighlight = (
  computedIndex: number | null,
  axis: ComputeResult<ChartsAxisProps>,
  axisItems: AxisItemIdentifier[] | undefined,
) => {
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
  ],
  selectAxisHighlight,
);

export const selectorChartsHighlightYAxisIndex = createSelector(
  [
    selectorChartsInteractionYAxisIndex,
    selectorChartYAxis,
    selectorChartControlledCartesianAxisHighlight,
  ],
  selectAxisHighlight,
);

const selectAxisHighlightWithValue = (
  computedIndex: number | null,
  computedValue: number | Date | null,
  axis: ComputeResult<ChartsAxisProps>,
  axisItems: AxisItemIdentifier[] | undefined,
) => {
  if (axisItems !== undefined) {
    return axisItems
      .map((item) => ({
        ...item,
        value: axis.axis[item.axisId]?.data?.[item.dataIndex],
      }))
      .filter(({ value }) => value !== undefined);
  }
  return computedValue === null
    ? []
    : [{ axisId: axis.axisIds[0], dataIndex: computedIndex, value: computedValue }];
};

export const selectorChartsHighlightXAxisValue = createSelector(
  [
    selectorChartsInteractionXAxisIndex,
    selectorChartsInteractionXAxisValue,
    selectorChartXAxis,
    selectorChartControlledCartesianAxisHighlight,
  ],
  selectAxisHighlightWithValue,
);

export const selectorChartsHighlightYAxisValue = createSelector(
  [
    selectorChartsInteractionYAxisIndex,
    selectorChartsInteractionYAxisValue,
    selectorChartYAxis,
    selectorChartControlledCartesianAxisHighlight,
  ], selectAxisHighlightWithValue
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
