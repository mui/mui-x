import { createSelector, createSelectorMemoizedWithOptions } from '@mui/x-internals/store';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';
import {
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
} from '../useChartInteraction';
import { getAxisIndex } from './getAxisValue';
import type { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import type { ChartState } from '../../models/chart';
import type { AxisItemIdentifier } from '../../../../models/axis';

const selectorChartControlledCartesianAxisTooltip = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.controlledCartesianAxisTooltip;

const EMPTY_ARRAY: AxisItemIdentifier[] = [];

/**
 * Get x-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipXAxes = createSelectorMemoizedWithOptions({
  memoizeOptions: {
    // Keep the same reference if array content is the same.
    // If possible, avoid this pattern by creating selectors that
    // uses string/number as arguments.
    resultEqualityCheck: isDeepEqual,
  },
})(
  selectorChartControlledCartesianAxisTooltip,
  selectorChartsInteractionPointerX,
  selectorChartXAxis,
  (controlledValues, value, axes) => {
    if (controlledValues !== undefined) {
      if (controlledValues.length === 0) {
        return EMPTY_ARRAY;
      }
      const ids = new Set(axes.axisIds);

      const filteredArray = controlledValues.filter(({ axisId }) => ids.has(axisId));
      return filteredArray.length === controlledValues.length ? controlledValues : filteredArray;
    }

    if (value === null) {
      return EMPTY_ARRAY;
    }

    return axes.axisIds
      .filter((id) => axes.axis[id].triggerTooltip)
      .map(
        (axisId): AxisItemIdentifier => ({
          axisId,
          dataIndex: getAxisIndex(axes.axis[axisId], value),
        }),
      )
      .filter(({ dataIndex }) => dataIndex >= 0);
  },
);

/**
 * Get y-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipYAxes = createSelectorMemoizedWithOptions({
  memoizeOptions: {
    // Keep the same reference if array content is the same.
    // If possible, avoid this pattern by creating selectors that
    // uses string/number as arguments.
    resultEqualityCheck: isDeepEqual,
  },
})(
  selectorChartControlledCartesianAxisTooltip,
  selectorChartsInteractionPointerY,
  selectorChartYAxis,
  (controlledValues, value, axes) => {
    if (controlledValues !== undefined) {
      if (controlledValues.length === 0) {
        return EMPTY_ARRAY;
      }
      const ids = new Set(axes.axisIds);

      const filteredArray = controlledValues.filter(({ axisId }) => ids.has(axisId));
      return filteredArray.length === controlledValues.length ? controlledValues : filteredArray;
    }

    if (value === null) {
      return EMPTY_ARRAY;
    }

    return axes.axisIds
      .filter((id) => axes.axis[id].triggerTooltip)
      .map(
        (axisId): AxisItemIdentifier => ({
          axisId,
          dataIndex: getAxisIndex(axes.axis[axisId], value),
        }),
      )
      .filter(({ dataIndex }) => dataIndex >= 0);
  },
);

/**
 * Return `true` if the axis tooltip has something to display.
 */
export const selectorChartsInteractionAxisTooltip = createSelector(
  selectorChartsInteractionTooltipXAxes,
  selectorChartsInteractionTooltipYAxes,
  (xTooltip, yTooltip) => xTooltip.length > 0 || yTooltip.length > 0,
);
