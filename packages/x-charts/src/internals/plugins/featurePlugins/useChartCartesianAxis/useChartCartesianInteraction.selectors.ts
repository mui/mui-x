import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { createSelector } from '../../utils/selectors';
import { AxisId, AxisItemIdentifier, ChartsAxisProps } from '../../../../models/axis';
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
  [selectorChartsInteractionPointerX, selectorChartXAxis, optionalGetAxisId],
  selectChartsInteractionAxisIndex,
);

export const selectorChartsInteractionYAxisIndex = createSelector(
  [selectorChartsInteractionPointerY, selectorChartYAxis, optionalGetAxisId],
  selectChartsInteractionAxisIndex,
);

export const selectorChartAxisInteraction = createSelector(
  [
    selectorChartsInteractionPointerX,
    selectorChartsInteractionPointerY,
    selectorChartXAxis,
    selectorChartYAxis,
  ],
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
