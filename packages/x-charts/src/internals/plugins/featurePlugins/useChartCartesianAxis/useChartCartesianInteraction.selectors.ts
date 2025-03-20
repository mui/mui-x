import { createSelector } from '../../utils/selectors';
import { AxisId, ChartsAxisProps } from '../../../../models/axis';
import {
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
} from '../useChartInteraction/useChartInteraction.selectors';
import { getAxisIndex, getAxisValue } from './getAxisValue';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';
import { ComputeResult } from './computeAxisValue';

const optionalGetAxisId = (_: unknown, id?: AxisId) => id;
const optionalGetAxisIds = (_: unknown, ids: AxisId[]) => ids;

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

export const selectorChartsInteractionXAxisIndex = createSelector(
  [selectorChartsInteractionPointerX, selectorChartXAxis, optionalGetAxisId],
  (value, axes, id) => (value === null ? null : indexGetter(value, axes, id)),
);

export const selectorChartsInteractionXAxisIndexes = createSelector(
  [selectorChartsInteractionPointerX, selectorChartXAxis, optionalGetAxisIds],
  (value, axes, ids) => (value === null ? null : indexGetter(value, axes, ids)),
);

export const selectorChartsInteractionYAxisIndex = createSelector(
  [selectorChartsInteractionPointerY, selectorChartYAxis, optionalGetAxisId],
  (value, axes, id) => (value === null ? null : indexGetter(value, axes, id)),
);

export const selectorChartsInteractionYAxisIndexes = createSelector(
  [selectorChartsInteractionPointerY, selectorChartYAxis, optionalGetAxisIds],
  (value, axes, ids) => (value === null ? null : indexGetter(value, axes, ids)),
);

/**
 * Get interaction values
 */

type Value = number | Date | null;

function valueGetter(
  value: number,
  axes: ComputeResult<ChartsAxisProps>,
  indexes: number,
  ids?: AxisId,
): Value;
function valueGetter(
  value: number,
  axes: ComputeResult<ChartsAxisProps>,
  indexes: number[],
  ids: AxisId[],
): Value[];
function valueGetter(
  value: number,
  axes: ComputeResult<ChartsAxisProps>,
  indexes: number | number[],
  ids: AxisId | AxisId[] = axes.axisIds[0],
): Value | Value[] {
  return Array.isArray(ids)
    ? ids.map((id, axisIndex) =>
        getAxisValue(axes.axis[id], value, (indexes as number[])[axisIndex]),
      )
    : getAxisValue(axes.axis[ids], value, indexes as number);
}
export const selectorChartsInteractionXAxisValues = createSelector(
  [
    selectorChartsInteractionPointerX,
    selectorChartXAxis,
    selectorChartsInteractionXAxisIndexes,
    optionalGetAxisIds,
  ],
  (value, axes, indexes, ids) => (value === null ? null : valueGetter(value, axes, indexes!, ids)),
);

export const selectorChartsInteractionXAxisValue = createSelector(
  [
    selectorChartsInteractionPointerX,
    selectorChartXAxis,
    selectorChartsInteractionXAxisIndex,
    optionalGetAxisId,
  ],
  (value, axes, index, id) => (value === null ? null : valueGetter(value, axes, index!, id)),
);

export const selectorChartsInteractionYAxisValues = createSelector(
  [
    selectorChartsInteractionPointerY,
    selectorChartYAxis,
    selectorChartsInteractionYAxisIndexes,
    optionalGetAxisIds,
  ],
  (value, axes, indexes, ids) => (value === null ? null : valueGetter(value, axes, indexes!, ids)),
);

export const selectorChartsInteractionYAxisValue = createSelector(
  [
    selectorChartsInteractionPointerY,
    selectorChartYAxis,
    selectorChartsInteractionYAxisIndex,
    optionalGetAxisId,
  ],
  (value, axes, index, id) => (value === null ? null : valueGetter(value, axes, index!, id)),
);

/**
 * Know if tooltip is active for y-axis
 */

export const selectorChartsInteractionTooltipXAxes = createSelector(
  [selectorChartsInteractionPointerX, selectorChartXAxis],
  (value, axes) => {
    if (value === null) {
      return [];
    }

    return axes.axisIds
      .filter((id) => axes.axis[id].triggerTooltip)
      .map((axisId) => ({ axisId, dataIndex: getAxisIndex(axes.axis[axisId], value) }))
      .filter(({ dataIndex }) => dataIndex >= 0);
  },
);

export const selectorChartsInteractionTooltipYAxes = createSelector(
  [selectorChartsInteractionPointerY, selectorChartYAxis],
  (value, axes) => {
    if (value === null) {
      return [];
    }

    return axes.axisIds
      .filter((id) => axes.axis[id].triggerTooltip)
      .map((axisId) => ({ axisId, dataIndex: getAxisIndex(axes.axis[axisId], value) }))
      .filter(({ dataIndex }) => dataIndex >= 0);
  },
);

export const selectorChartsInteractionAxisTooltip = createSelector(
  [selectorChartsInteractionTooltipXAxes, selectorChartsInteractionTooltipYAxes],
  (xTooltip, yTooltip) => xTooltip.length > 0 || yTooltip.length > 0,
);
