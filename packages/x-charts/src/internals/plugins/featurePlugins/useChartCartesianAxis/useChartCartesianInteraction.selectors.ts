import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { createSelector, createSelectorMemoizedWithOptions } from '@mui/x-internals/store';
import {
  type AxisId,
  type AxisItemIdentifier,
  type ChartsAxisProps,
} from '../../../../models/axis';
import {
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
} from '../useChartInteraction/useChartInteraction.selectors';
import { getAxisIndex, getAxisValue } from './getAxisValue';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';
import { type ComputeResult } from './computeAxisValue';

/**
 * Get interaction indexes
 */

function indexGetter(value: number, axes: ComputeResult<ChartsAxisProps>, ids?: AxisId): number;
function indexGetter(value: number, axes: ComputeResult<ChartsAxisProps>, ids: AxisId[]): number[];
function indexGetter(
  value: number,
  axes: ComputeResult<ChartsAxisProps>,
  ids: AxisId | AxisId[] = axes.axisIds[0],
): number | number[] {
  return Array.isArray(ids)
    ? ids.map((id) => getAxisIndex(axes.axis[id], value))
    : getAxisIndex(axes.axis[ids], value);
}
export const selectChartsInteractionAxisIndex = (
  value: number | null,
  axes: ComputeResult<ChartsAxisProps>,
  id?: AxisId,
) => {
  if (value === null) {
    return null;
  }
  const index = indexGetter(value, axes, id);
  return index === -1 ? null : index;
};

export const selectorChartsInteractionXAxisIndex = createSelector(
  selectorChartsInteractionPointerX,
  selectorChartXAxis,
  selectChartsInteractionAxisIndex,
);

export const selectorChartsInteractionYAxisIndex = createSelector(
  selectorChartsInteractionPointerY,
  selectorChartYAxis,
  selectChartsInteractionAxisIndex,
);

export const selectorChartAxisInteraction = createSelector(
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
  selectorChartXAxis,
  selectorChartYAxis,

  (x, y, xAxis, yAxis) =>
    [
      ...(x === null
        ? []
        : xAxis.axisIds.map((axisId) => ({ axisId, dataIndex: indexGetter(x, xAxis, axisId) }))),
      ...(y === null
        ? []
        : yAxis.axisIds.map((axisId) => ({ axisId, dataIndex: indexGetter(y, yAxis, axisId) }))),
    ].filter((item) => item.dataIndex !== null && item.dataIndex >= 0),
);

/**
 * Get interaction values
 */

type Value = number | Date | null;

function valueGetter(
  value: number,
  axes: ComputeResult<ChartsAxisProps>,
  indexes: number | null,
  ids?: AxisId,
): Value;
function valueGetter(
  value: number,
  axes: ComputeResult<ChartsAxisProps>,
  indexes: (number | null)[],
  ids: AxisId[],
): Value[];
function valueGetter(
  value: number,
  axes: ComputeResult<ChartsAxisProps>,
  indexes: number | null | (number | null)[],
  ids: AxisId | AxisId[] = axes.axisIds[0],
): Value | Value[] {
  return Array.isArray(ids)
    ? ids.map((id, axisIndex) => {
        const axis = axes.axis[id];

        return getAxisValue(
          axis.scale,
          axis.data,
          value,
          (indexes as (number | null)[])[axisIndex],
        );
      })
    : getAxisValue(axes.axis[ids].scale, axes.axis[ids].data, value, indexes as number | null);
}

export const selectorChartsInteractionXAxisValue = createSelector(
  selectorChartsInteractionPointerX,
  selectorChartXAxis,
  selectorChartsInteractionXAxisIndex,
  (x, xAxes, xIndex, id?: AxisId) => {
    if (x === null || xAxes.axisIds.length === 0) {
      return null;
    }
    return valueGetter(x, xAxes, xIndex, id);
  },
);

export const selectorChartsInteractionYAxisValue = createSelector(
  selectorChartsInteractionPointerY,
  selectorChartYAxis,
  selectorChartsInteractionYAxisIndex,
  (y, yAxes, yIndex, id?: AxisId) => {
    if (y === null || yAxes.axisIds.length === 0) {
      return null;
    }
    return valueGetter(y, yAxes, yIndex, id);
  },
);

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
})(selectorChartsInteractionPointerX, selectorChartXAxis, (value, axes) => {
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
});

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
})(selectorChartsInteractionPointerY, selectorChartYAxis, (value, axes) => {
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
});

/**
 * Return `true` if the axis tooltip has something to display.
 */
export const selectorChartsInteractionAxisTooltip = createSelector(
  selectorChartsInteractionTooltipXAxes,
  selectorChartsInteractionTooltipYAxes,
  (xTooltip, yTooltip) => xTooltip.length > 0 || yTooltip.length > 0,
);
