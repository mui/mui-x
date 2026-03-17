import { createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import type { AxisId, ContinuousScaleName, DefaultedAxis } from '../../../../models/axis';
import { isBandScaleConfig, isPointScaleConfig } from '../../../../models/axis';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import {
  selectorChartXAxisExtrema,
  selectorChartYAxisExtrema,
} from './useChartAxisExtrema.selectors';
import { calculateInitialDomainAndTickNumber } from './domain';

/**
 * Default tick number used for auto-size domain computation.
 * We use a fixed value instead of deriving it from the drawing area
 * to avoid a circular dependency (auto-size → drawing area → axis sizes → auto-size).
 */
const DEFAULT_TICK_NUMBER = 8;

export interface AxisDomainForAutoSize {
  domain: [number, number];
  tickNumber: number;
}

const EMPTY_DOMAINS: Record<AxisId, AxisDomainForAutoSize> = {};

/**
 * Selector that computes niced domains for X axes (continuous only).
 * Used by auto-size to get accurate tick labels that match what the chart actually displays.
 */
export const selectorChartXAxisDomainsForAutoSize = createSelectorMemoized(
  selectorChartRawXAxis,
  selectorChartSeriesProcessed,
  selectorChartXAxisExtrema,
  function selectorChartXAxisDomainsForAutoSize(axes, formattedSeries, extremaMap) {
    const domains: Record<AxisId, AxisDomainForAutoSize> = {};
    let hasDomains = false;

    axes?.forEach((axis, axisIndex) => {
      if (isBandScaleConfig(axis) || isPointScaleConfig(axis)) {
        return;
      }

      const extrema = extremaMap[axis.id];
      if (!extrema) {
        return;
      }

      const { domain, tickNumber } = calculateInitialDomainAndTickNumber(
        axis as DefaultedAxis<ContinuousScaleName>,
        'x',
        axisIndex,
        formattedSeries,
        extrema,
        DEFAULT_TICK_NUMBER,
      );

      domains[axis.id] = {
        domain: [Number(domain[0]), Number(domain[1])],
        tickNumber,
      };
      hasDomains = true;
    });

    return hasDomains ? domains : EMPTY_DOMAINS;
  },
);

/**
 * Selector that computes niced domains for Y axes (continuous only).
 * Used by auto-size to get accurate tick labels that match what the chart actually displays.
 */
export const selectorChartYAxisDomainsForAutoSize = createSelectorMemoized(
  selectorChartRawYAxis,
  selectorChartSeriesProcessed,
  selectorChartYAxisExtrema,
  function selectorChartYAxisDomainsForAutoSize(axes, formattedSeries, extremaMap) {
    const domains: Record<AxisId, AxisDomainForAutoSize> = {};
    let hasDomains = false;

    axes?.forEach((axis, axisIndex) => {
      if (isBandScaleConfig(axis) || isPointScaleConfig(axis)) {
        return;
      }

      const extrema = extremaMap[axis.id];
      if (!extrema) {
        return;
      }

      const { domain, tickNumber } = calculateInitialDomainAndTickNumber(
        axis as DefaultedAxis<ContinuousScaleName>,
        'y',
        axisIndex,
        formattedSeries,
        extrema,
        DEFAULT_TICK_NUMBER,
      );

      domains[axis.id] = {
        domain: [Number(domain[0]), Number(domain[1])],
        tickNumber,
      };
      hasDomains = true;
    });

    return hasDomains ? domains : EMPTY_DOMAINS;
  },
);
