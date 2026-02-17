import {
  createSelector,
  createSelectorMemoized,
  createSelectorMemoizedWithOptions,
} from '@mui/x-internals/store';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';
import {
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
} from '../useChartInteraction';
import { getAxisIndex } from './getAxisValue';
import type { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import type { ChartState } from '../../models/chart';
import type {
  AxisItemIdentifier,
  ChartsAxisProps,
  ChartsXAxisProps,
  ChartsYAxisProps,
} from '../../../../models/axis';
import type { ComputeResult } from './computeAxisValue';
import { getValueToPositionMapper } from '../../../../hooks/useScale';
import type { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions/useChartDimensions.selectors';

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

function getCoordinatesFromAxis(
  identifier: AxisItemIdentifier,
  axes: ComputeResult<ChartsAxisProps>,
): number | null {
  const axis = axes.axis[identifier.axisId];
  if (!axis) {
    return null;
  }
  const value = axis.data?.[identifier.dataIndex];
  if (value == null) {
    return null;
  }
  const coordinate = getValueToPositionMapper(axis.scale)(value);
  if (coordinate === undefined) {
    return null;
  }
  return coordinate;
}

export const selectorChartsTooltipAxisPosition = createSelectorMemoized(
  selectorChartsInteractionTooltipXAxes,
  selectorChartsInteractionTooltipYAxes,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartDrawingArea,

  function selectorChartsTooltipItemPosition(
    xAxesIdentifiers: AxisItemIdentifier[],
    yAxesIdentifiers: AxisItemIdentifier[],
    xAxes: ComputeResult<ChartsXAxisProps>,
    yAxes: ComputeResult<ChartsYAxisProps>,
    drawingArea: ChartDrawingArea,
    placement?: 'top' | 'bottom' | 'left' | 'right',
  ) {
    if (xAxesIdentifiers.length === 0 && yAxesIdentifiers.length === 0) {
      return null;
    }

    if (xAxesIdentifiers.length > 0) {
      const x = getCoordinatesFromAxis(xAxesIdentifiers[0], xAxes);
      if (x === null) {
        return null;
      }
      switch (placement) {
        case 'left':
        case 'right':
          return { x, y: drawingArea.top + drawingArea.height / 2 };
        case 'bottom':
          return { x, y: drawingArea.top + drawingArea.height };
        case 'top':
        default:
          return { x, y: drawingArea.top };
      }
    }

    if (yAxesIdentifiers.length > 0) {
      const y = getCoordinatesFromAxis(yAxesIdentifiers[0], yAxes);
      if (y === null) {
        return null;
      }

      switch (placement) {
        case 'right':
          return { x: drawingArea.left + drawingArea.width / 2, y };
        case 'bottom':
        case 'top':
          return { x: drawingArea.left + drawingArea.width / 2, y };
        case 'left':
        default:
          return { x: drawingArea.left + drawingArea.width / 2, y };
      }
    }
    return null;
  },
);
