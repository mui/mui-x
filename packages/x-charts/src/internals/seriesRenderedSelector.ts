'use client';
import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type ChartsSeriesConfig } from '../models/seriesType/config';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import { selectorChartDrawingArea } from './plugins/corePlugins/useChartDimensions';
import {
  type ProcessedSeries,
  type ChartSeriesSamplerContext,
} from './plugins/corePlugins/useChartSeries/useChartSeries.types';
import { type ChartRootSelector } from './plugins/utils/selectors';
import { type UseChartSeriesSignature } from './plugins/corePlugins/useChartSeries';
import {
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
  selectorChartDefaultXAxisId,
  selectorChartDefaultYAxisId,
  selectorChartXScales,
  selectorChartYScales,
} from './plugins/featurePlugins/useChartCartesianAxis';
import { useStore } from './store/useStore';

/**
 * The sampling registry populated by the Pro sampling plugin. `undefined` in the community package
 * (and whenever no Pro sampling plugin runs), which makes the rendered-series selector below an
 * identity passthrough.
 */
export const selectorChartSamplingState: ChartRootSelector<UseChartSeriesSignature, 'sampling'> = (
  state,
) => state.sampling;

/**
 * A quantized zoom level derived from the zoom state: `0` when not zoomed, increasing by one each
 * time the visible range roughly halves. The level is measured against the axis's zoomable extent
 * (`maxEnd - minStart`), not a fixed 0–100 span, so an axis that can only be zoomed within part of
 * its range still reaches level 0 when fully zoomed out. This is a primitive number, so the
 * rendered-series selector below only recomputes when the level actually changes — not on every
 * frame of a zoom or pan gesture. That is what keeps the sampled shape stable (no flicker).
 */
export const selectorChartSamplingZoomLevel = createSelector(
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
  function selectorChartSamplingZoomLevel(zoomMap, optionsLookup) {
    let level = 0;
    zoomMap?.forEach((zoom, axisId) => {
      const options = optionsLookup[axisId];
      const minStart = options?.minStart ?? 0;
      const maxEnd = options?.maxEnd ?? 100;
      const fullRange = maxEnd - minStart;
      const span = zoom.end - zoom.start;
      if (span > 0 && span < fullRange) {
        // `floor` keeps level 0 until the visible range has roughly halved, so the first reflow
        // only happens after a meaningful zoom rather than on the first wheel tick.
        level = Math.max(level, Math.floor(Math.log2(fullRange / span)));
      }
    });
    return level;
  },
);

/**
 * The series as they should be rendered, after applying per-series downsampling.
 *
 * Consumed ONLY by the rendering context hooks (`useLineSeriesContext` and friends). Everything
 * else — extremums, axis domain, tooltip, highlight, keyboard navigation, item interaction — keeps
 * reading `selectorChartSeriesProcessed`, so it always works on the full data.
 *
 * The downsampling itself is driven by the quantized zoom level (not the live scale), so the
 * sampled set is stable while panning. The live scales are passed to the samplers only so they can
 * switch to rendering every visible point once few enough remain in view. When no sampler is
 * registered it returns the processed series by reference.
 */
export const selectorChartSeriesRendered = createSelectorMemoized(
  selectorChartSeriesProcessed,
  selectorChartSamplingState,
  selectorChartDrawingArea,
  selectorChartSamplingZoomLevel,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
  selectorChartDefaultXAxisId,
  selectorChartDefaultYAxisId,
  selectorChartXScales,
  selectorChartYScales,
  function selectorChartSeriesRendered(
    processedSeries,
    samplingState,
    drawingArea,
    zoomLevel,
    rawXAxes,
    rawYAxes,
    defaultXAxisId,
    defaultYAxisId,
    xScales,
    yScales,
  ): ProcessedSeries {
    const samplers = samplingState?.samplers;
    // Identity passthrough: no samplers registered, or nothing to draw into.
    if (!samplers || drawingArea.width <= 0 || drawingArea.height <= 0) {
      return processedSeries;
    }

    let result = processedSeries;

    (Object.keys(processedSeries) as (keyof ProcessedSeries)[]).forEach((type) => {
      const sampler = samplers[type] as
        | ((series: unknown, context: ChartSeriesSamplerContext) => number[] | null)
        | undefined;
      // The heterogeneous ProcessedSeries union does not narrow per key, so we work loosely here.
      const group = processedSeries[type] as
        | { series: Record<string, any>; seriesOrder: string[] }
        | undefined;
      if (!sampler || !group) {
        return;
      }

      let nextSeries: Record<string, any> | undefined;

      const assign = (ids: string[], indices: number[]) => {
        if (!nextSeries) {
          nextSeries = { ...group.series };
        }
        for (const id of ids) {
          if (group.series[id]) {
            nextSeries[id] = { ...group.series[id], sampledIndices: indices };
          }
        }
      };

      const buildContext = (series: any): ChartSeriesSamplerContext | null => {
        const xAxisId = series.xAxisId ?? defaultXAxisId;
        const yAxisId = series.yAxisId ?? defaultYAxisId;
        const xScale = xScales[xAxisId];
        const yScale = yScales[yAxisId];
        if (!xScale || !yScale) {
          return null;
        }
        return {
          drawingArea,
          zoomLevel,
          xScale,
          yScale,
          xData: rawXAxes?.find((axis) => axis.id === xAxisId)?.data,
          yData: rawYAxes?.find((axis) => axis.id === yAxisId)?.data,
        };
      };

      const stackingGroups = (group as { stackingGroups?: { ids: string[] }[] }).stackingGroups;

      if (Array.isArray(stackingGroups)) {
        // Stacked series must keep the SAME indices to stay aligned, so each stacking group is
        // sampled once — on its silhouette — and the result is shared by every member. Unstacked
        // series are singleton groups, so this also covers the non-stacked case.
        for (const stack of stackingGroups) {
          const ids = stack.ids.filter((id) => group.series[id]);
          const samplingId = ids.find((id) => group.series[id].sampling);
          if (!samplingId) {
            continue;
          }
          // Sample the representative member directly — its already-computed `visibleStackedData`
          // is the cumulative stack position, so no synthetic series needs to be rebuilt — then
          // share the resulting indices with every member so the layers stay aligned.
          const base = group.series[samplingId];
          const context = buildContext(base);
          if (!context) {
            continue;
          }
          const indices = sampler(base, context);
          if (indices) {
            assign(ids, indices);
          }
        }
      } else {
        for (const seriesId of group.seriesOrder) {
          const series = group.series[seriesId];
          if (!series || !series.sampling) {
            continue;
          }
          const context = buildContext(series);
          if (!context) {
            continue;
          }
          const indices = sampler(series, context);
          if (indices) {
            assign([seriesId], indices);
          }
        }
      }

      if (nextSeries) {
        if (result === processedSeries) {
          result = { ...processedSeries };
        }
        (result as Record<string, any>)[type] = { ...group, series: nextSeries };
      }
    });

    return result;
  },
);

export const selectorAllRenderedSeriesOfType = createSelector(
  selectorChartSeriesRendered,
  <T extends keyof ChartsSeriesConfig>(renderedSeries: ProcessedSeries, seriesType: T) =>
    renderedSeries[seriesType],
);

/**
 * Hook used by the rendering context hooks to access the (possibly downsampled) series.
 */
export const useAllRenderedSeriesOfType = <T extends keyof ChartsSeriesConfig>(seriesType: T) => {
  const store = useStore();
  return store.use(selectorAllRenderedSeriesOfType, seriesType) as ProcessedSeries[T];
};
