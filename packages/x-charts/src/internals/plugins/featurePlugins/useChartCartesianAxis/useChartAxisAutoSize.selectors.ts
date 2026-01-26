import { createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import { computeAxisAutoSize } from './computeAxisAutoSize';
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

/**
 * Selector that computes auto-sizes for X axes that have `height: 'auto'`.
 * Returns a map of axis ID to computed height.
 */
export const selectorChartXAxisAutoSizes = createSelectorMemoized(
  selectorChartRawXAxis,
  selectorIsHydrated,
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  function selectorChartXAxisAutoSizes(xAxes, isHydrated, formattedSeries, seriesConfig) {
    // Early return if no axes have auto-sizing - avoid expensive computations
    const hasAutoAxis = xAxes?.some((axis) => axis.height === 'auto');
    if (!hasAutoAxis) {
      return EMPTY_SIZES;
    }

    const sizes: Record<AxisId, number> = {};

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
          sizes[axis.id] = computed;
        }
      }
    }

    return sizes;
  },
);

/**
 * Selector that computes auto-sizes for Y axes that have `width: 'auto'`.
 * Returns a map of axis ID to computed width.
 */
export const selectorChartYAxisAutoSizes = createSelectorMemoized(
  selectorChartRawYAxis,
  selectorIsHydrated,
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  function selectorChartYAxisAutoSizes(yAxes, isHydrated, formattedSeries, seriesConfig) {
    // Early return if no axes have auto-sizing - avoid expensive computations
    const hasAutoAxis = yAxes?.some((axis) => axis.width === 'auto');
    if (!hasAutoAxis) {
      return EMPTY_SIZES;
    }

    const sizes: Record<AxisId, number> = {};

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
          sizes[axis.id] = computed;
        }
      }
    }

    return sizes;
  },
);
