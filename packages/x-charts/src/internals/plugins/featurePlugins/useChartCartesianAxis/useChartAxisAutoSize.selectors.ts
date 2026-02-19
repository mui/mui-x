import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import {
  computeAxisAutoSize,
  isGroupedAxisAutoSizeResult,
  type AxisAutoSizeResult,
} from './computeAxisAutoSize';
import type { AxisId } from '../../../../models/axis';
import { selectorChartDimensionsState } from '../../corePlugins/useChartDimensions';

// Direct state access to avoid circular dependency
const selectorIsHydrated = createSelector(
  selectorChartDimensionsState,
  ({ width, height }) => width && height,
);

const EMPTY_SIZES: Record<AxisId, number> = {};
const EMPTY_RESULTS: Record<AxisId, AxisAutoSizeResult> = {};

/**
 * Helper to extract just the size from an auto-size result.
 */
function getSize(result: AxisAutoSizeResult): number {
  return isGroupedAxisAutoSizeResult(result) ? result.size : result;
}

/**
 * Selector that computes full auto-size results for X axes that have `height: 'auto'`.
 * Returns a map of axis ID to full result (including group tick sizes for grouped axes).
 */
export const selectorChartXAxisAutoSizeResults = createSelectorMemoized(
  selectorChartRawXAxis,
  selectorIsHydrated,
  function selectorChartXAxisAutoSizeResults(xAxes, isHydrated) {
    // Early return if no axes have auto-sizing - avoid expensive computations
    const hasAutoAxis = xAxes?.some((axis) => axis.height === 'auto');
    if (!hasAutoAxis || !isHydrated) {
      return EMPTY_RESULTS;
    }

    const results: Record<AxisId, AxisAutoSizeResult> = {};

    for (let axisIndex = 0; axisIndex < (xAxes?.length ?? 0); axisIndex += 1) {
      const axis = xAxes![axisIndex];
      if (axis.height === 'auto') {
        const computed = computeAxisAutoSize({
          axis,
          direction: 'x',
        });
        if (computed !== undefined) {
          results[axis.id] = computed;
        }
      }
    }

    return results;
  },
);

/**
 * Selector that computes auto-sizes for X axes that have `height: 'auto'`.
 * Returns a map of axis ID to computed height (just the size, not group tick sizes).
 */
export const selectorChartXAxisAutoSizes = createSelectorMemoized(
  selectorChartXAxisAutoSizeResults,
  function selectorChartXAxisAutoSizes(results) {
    if (results === EMPTY_RESULTS) {
      return EMPTY_SIZES;
    }

    const sizes: Record<AxisId, number> = {};
    for (const [axisId, result] of Object.entries(results)) {
      sizes[axisId as AxisId] = getSize(result);
    }
    return sizes;
  },
);

/**
 * Selector that computes full auto-size results for Y axes that have `width: 'auto'`.
 * Returns a map of axis ID to full result (including group tick sizes for grouped axes).
 */
export const selectorChartYAxisAutoSizeResults = createSelectorMemoized(
  selectorChartRawYAxis,
  selectorIsHydrated,
  function selectorChartYAxisAutoSizeResults(yAxes, isHydrated) {
    // Early return if no axes have auto-sizing - avoid expensive computations
    const hasAutoAxis = yAxes?.some((axis) => axis.width === 'auto');
    if (!hasAutoAxis || !isHydrated) {
      return EMPTY_RESULTS;
    }

    const results: Record<AxisId, AxisAutoSizeResult> = {};

    for (let axisIndex = 0; axisIndex < (yAxes?.length ?? 0); axisIndex += 1) {
      const axis = yAxes![axisIndex];
      if (axis.width === 'auto') {
        const computed = computeAxisAutoSize({
          axis,
          direction: 'y',
        });
        if (computed !== undefined) {
          results[axis.id] = computed;
        }
      }
    }

    return results;
  },
);

/**
 * Selector that computes auto-sizes for Y axes that have `width: 'auto'`.
 * Returns a map of axis ID to computed width (just the size, not group tick sizes).
 */
export const selectorChartYAxisAutoSizes = createSelectorMemoized(
  selectorChartYAxisAutoSizeResults,
  function selectorChartYAxisAutoSizes(results) {
    if (results === EMPTY_RESULTS) {
      return EMPTY_SIZES;
    }

    const sizes: Record<AxisId, number> = {};
    for (const [axisId, result] of Object.entries(results)) {
      sizes[axisId as AxisId] = getSize(result);
    }
    return sizes;
  },
);
