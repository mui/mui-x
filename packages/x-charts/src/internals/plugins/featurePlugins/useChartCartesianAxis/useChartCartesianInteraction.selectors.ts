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

export const selectorChartsInteractionYAxisIndex = createSelector(
  [selectorChartsInteractionPointerY, selectorChartYAxis, optionalGetAxisId],
  (value, axes, id) => (value === null ? null : indexGetter(value, axes, id)),
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

export const selectorChartsInteractionXAxisValue = createSelector(
  [
    selectorChartsInteractionPointerX,
    selectorChartXAxis,
    selectorChartsInteractionXAxisIndex,
    optionalGetAxisId,
  ],
  (x, xAxes, xIndex, id) => {
    if (x === null || xIndex === null || xAxes.axisIds.length === 0) {
      return null;
    }
    return valueGetter(x, xAxes, xIndex, id);
  },
);

export const selectorChartsInteractionYAxisValue = createSelector(
  [
    selectorChartsInteractionPointerY,
    selectorChartYAxis,
    selectorChartsInteractionYAxisIndex,
    optionalGetAxisId,
  ],
  (y, yAxes, yIndex, id) => {
    if (y === null || yIndex === null || yAxes.axisIds.length === 0) {
      return null;
    }
    return valueGetter(y, yAxes, yIndex, id);
  },
);

/**
 * Get x-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipXAxes = createSelector(
  [selectorChartsInteractionPointerX, selectorChartXAxis],
  (value, axes) => {
    if (value === null) {
      return [];
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
export const selectorChartsInteractionTooltipYAxes = createSelector(
  [selectorChartsInteractionPointerY, selectorChartYAxis],
  (value, axes) => {
    if (value === null) {
      return [];
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
  [selectorChartsInteractionTooltipXAxes, selectorChartsInteractionTooltipYAxes],
  (xTooltip, yTooltip) => xTooltip.length > 0 || yTooltip.length > 0,
);

export type AxisItemIdentifier = { axisId: string; dataIndex: number };

export function compareTooltipAxes(a: AxisItemIdentifier[], b: AxisItemIdentifier[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((_, i) => a[i].axisId === b[i].axisId && a[i].dataIndex === b[i].dataIndex);
}
