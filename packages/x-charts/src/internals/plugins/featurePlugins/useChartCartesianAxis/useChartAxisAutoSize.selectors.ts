import { createSelectorMemoized } from '@mui/x-internals/store';
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
import type { ChartState } from '../../models/chart';
import type { UseChartDimensionsSignature } from '../../corePlugins/useChartDimensions/useChartDimensions.types';
import { getAxisExtrema } from './getAxisExtrema';
import type { CartesianChartSeriesType } from '../../../../models/seriesType/config';
import {
  type ChartSeriesConfig,
  selectorChartSeriesConfig,
} from '../../corePlugins/useChartSeriesConfig';
// Import directly from the selectors file to avoid circular dependency through useChartSeriesLayout.selectors.ts
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';

// Direct state access to avoid circular dependency
const selectorIsHydrated = (state: ChartState<[UseChartDimensionsSignature]>) =>
  state.dimensions.isHydrated;

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
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  function selectorChartXAxisAutoSizeResults(xAxes, isHydrated, formattedSeries, seriesConfig) {
    // Early return if no axes have auto-sizing - avoid expensive computations
    const hasAutoAxis = xAxes?.some((axis) => axis.height === 'auto');
    if (!hasAutoAxis) {
      return EMPTY_RESULTS;
    }

    const results: Record<AxisId, AxisAutoSizeResult> = {};

    for (let axisIndex = 0; axisIndex < (xAxes?.length ?? 0); axisIndex += 1) {
      const axis = xAxes![axisIndex];
      if (axis.height === 'auto') {
        // Get extrema for continuous scales (only if series data is available)
        let extrema: [number, number] | undefined;
        if (
          axis.scaleType !== 'band' &&
          axis.scaleType !== 'point' &&
          formattedSeries &&
          seriesConfig
        ) {
          extrema = getAxisExtrema(
            axis,
            'x',
            seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
            axisIndex,
            formattedSeries,
          );
        }

        const computed = computeAxisAutoSize({
          axis,
          direction: 'x',
          isHydrated,
          extrema,
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
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  function selectorChartYAxisAutoSizeResults(yAxes, isHydrated, formattedSeries, seriesConfig) {
    // Early return if no axes have auto-sizing - avoid expensive computations
    const hasAutoAxis = yAxes?.some((axis) => axis.width === 'auto');
    if (!hasAutoAxis) {
      return EMPTY_RESULTS;
    }

    const results: Record<AxisId, AxisAutoSizeResult> = {};

    for (let axisIndex = 0; axisIndex < (yAxes?.length ?? 0); axisIndex += 1) {
      const axis = yAxes![axisIndex];
      if (axis.width === 'auto') {
        // Get extrema for continuous scales (only if series data is available)
        let extrema: [number, number] | undefined;
        if (
          axis.scaleType !== 'band' &&
          axis.scaleType !== 'point' &&
          formattedSeries &&
          seriesConfig
        ) {
          extrema = getAxisExtrema(
            axis,
            'y',
            seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
            axisIndex,
            formattedSeries,
          );
        }

        const computed = computeAxisAutoSize({
          axis,
          direction: 'y',
          isHydrated,
          extrema,
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
