// import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { createChartSelector } from '../../utils/selectors';
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

export const selectorChartsInteractionXAxisIndex = createChartSelector(
  [selectorChartsInteractionPointerX, selectorChartXAxis, optionalGetAxisId],
  selectChartsInteractionAxisIndex,
);

export const selectorChartsInteractionYAxisIndex = createChartSelector(
  [selectorChartsInteractionPointerY, selectorChartYAxis, optionalGetAxisId],
  selectChartsInteractionAxisIndex,
);

export const selectorChartAxisInteraction = createChartSelector(
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

export const selectorChartsInteractionXAxisValue = createChartSelector(
  [
    selectorChartsInteractionPointerX,
    selectorChartXAxis,
    selectorChartsInteractionXAxisIndex,
    optionalGetAxisId,
  ],
  (x, xAxes, xIndex, id) => {
    if (x === null || xAxes.axisIds.length === 0) {
      return null;
    }
    return valueGetter(x, xAxes, xIndex, id);
  },
);

export const selectorChartsInteractionYAxisValue = createChartSelector(
  [
    selectorChartsInteractionPointerY,
    selectorChartYAxis,
    selectorChartsInteractionYAxisIndex,
    optionalGetAxisId,
  ],
  (y, yAxes, yIndex, id) => {
    if (y === null || yAxes.axisIds.length === 0) {
      return null;
    }
    return valueGetter(y, yAxes, yIndex, id);
  },
);

/**
 * Get x-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipXAxes = createChartSelector(
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
  // {
  //   memoizeOptions: {
  //     // Keep the same reference if array content is the same.
  //     // If possible, avoid this pattern by creating selectors that
  //     // uses string/number as arguments.
  //     resultEqualityCheck: isDeepEqual,
  //   },
  // },
);

/**
 * Get y-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipYAxes = createChartSelector(
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
  // {
  //   memoizeOptions: {
  //     // Keep the same reference if array content is the same.
  //     // If possible, avoid this pattern by creating selectors that
  //     // uses string/number as arguments.
  //     resultEqualityCheck: isDeepEqual,
  //   },
  // },
);

/**
 * Return `true` if the axis tooltip has something to display.
 */
export const selectorChartsInteractionAxisTooltip = createChartSelector(
  [selectorChartsInteractionTooltipXAxes, selectorChartsInteractionTooltipYAxes],
  (xTooltip, yTooltip) => xTooltip.length > 0 || yTooltip.length > 0,
);
