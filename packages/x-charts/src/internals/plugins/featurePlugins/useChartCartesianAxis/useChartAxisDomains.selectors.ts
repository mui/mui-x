import { createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import type { AxisId } from '../../../../models/axis';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import {
  selectorChartXAxisExtrema,
  selectorChartYAxisExtrema,
} from './useChartAxisExtrema.selectors';
import { computeAxisDomainsMap, type DomainDefinition } from './domain';

/**
 * Default tick number used for auto-size domain computation.
 * We use a fixed value instead of deriving it from the drawing area
 * to avoid a circular dependency (auto-size → drawing area → axis sizes → auto-size).
 */
const DEFAULT_TICK_NUMBER = 8;

const EMPTY_DOMAINS: Record<AxisId, DomainDefinition> = {};

/**
 * Selector that computes niced domains for X axes.
 * Used by auto-size to get accurate tick labels that match what the chart actually displays.
 */
export const selectorChartXAxisDomainsForAutoSize = createSelectorMemoized(
  selectorChartRawXAxis,
  selectorChartSeriesProcessed,
  selectorChartXAxisExtrema,
  function selectorChartXAxisDomainsForAutoSize(axes, formattedSeries, extremaMap) {
    const domains = computeAxisDomainsMap(
      axes,
      formattedSeries,
      DEFAULT_TICK_NUMBER,
      extremaMap,
      'x',
    );

    return Object.keys(domains).length > 0 ? domains : EMPTY_DOMAINS;
  },
);

/**
 * Selector that computes niced domains for Y axes.
 * Used by auto-size to get accurate tick labels that match what the chart actually displays.
 */
export const selectorChartYAxisDomainsForAutoSize = createSelectorMemoized(
  selectorChartRawYAxis,
  selectorChartSeriesProcessed,
  selectorChartYAxisExtrema,
  function selectorChartYAxisDomainsForAutoSize(axes, formattedSeries, extremaMap) {
    const domains = computeAxisDomainsMap(
      axes,
      formattedSeries,
      DEFAULT_TICK_NUMBER,
      extremaMap,
      'y',
    );

    return Object.keys(domains).length > 0 ? domains : EMPTY_DOMAINS;
  },
);
