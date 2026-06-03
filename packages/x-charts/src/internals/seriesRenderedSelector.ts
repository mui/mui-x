'use client';
import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type SeriesId } from '../models/seriesType/common';
import { type AxisId } from '../models/axis';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import { selectorChartDrawingArea } from './plugins/corePlugins/useChartDimensions';
import { type ChartRootSelector } from './plugins/utils/selectors';
import { type UseChartSeriesSignature } from './plugins/corePlugins/useChartSeries';
import {
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
  selectorChartDefaultXAxisId,
  selectorChartDefaultYAxisId,
} from './plugins/featurePlugins/useChartCartesianAxis';
import { useStore } from './store/useStore';

/**
 * The sampling registry populated by the Pro sampling plugin. `undefined` in the community package
 * (and whenever no Pro sampling plugin runs), in which case no series is sampled.
 */
export const selectorChartSamplingState: ChartRootSelector<UseChartSeriesSignature, 'sampling'> = (
  state,
) => state.sampling;

/**
 * A quantized zoom level derived from the zoom state: `0` when not zoomed, increasing by one each
 * time the visible range roughly halves. The level is measured against the axis's zoomable extent
 * (`maxEnd - minStart`), not a fixed 0–100 span, so an axis that can only be zoomed within part of
 * its range still reaches level 0 when fully zoomed out. This is a primitive number, so the
 * sampled-indices selector below only recomputes when the level actually changes — not on every
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

const EMPTY_SAMPLED_INDICES: Record<SeriesId, number[]> = {};

/**
 * The render-only downsampling result: a map from series id to the sorted subset of original data
 * indices to render. This is a sidecar to the series data — the series objects themselves are never
 * mutated, so extremums, axis domain, tooltip, highlight, keyboard navigation and item interaction
 * keep working on the full data. Only the plot hooks read this map (through `useChartSampledIndices`)
 * to skip the dropped points while rendering.
 *
 * The actual algorithm lives in the Pro package: this selector only gathers the inputs and delegates
 * to the `computeSampledIndices` function the Pro sampling plugin puts in the store. Without that
 * plugin (community, or no Pro sampling) it returns an empty map and nothing is sampled.
 *
 * Sampling is driven entirely by the quantized zoom level, never the live scale, so this selector
 * recomputes only when the zoom level changes — not on every pan/zoom frame — and the sampled set
 * stays stable while panning.
 */
export const selectorChartSampledIndices = createSelectorMemoized(
  selectorChartSeriesProcessed,
  selectorChartSamplingState,
  selectorChartDrawingArea,
  selectorChartSamplingZoomLevel,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
  selectorChartDefaultXAxisId,
  selectorChartDefaultYAxisId,
  function selectorChartSampledIndices(
    processedSeries,
    samplingState,
    drawingArea,
    zoomLevel,
    rawXAxes,
    rawYAxes,
    defaultXAxisId,
    defaultYAxisId,
  ): Record<SeriesId, number[]> {
    if (!samplingState || drawingArea.width <= 0 || drawingArea.height <= 0) {
      return EMPTY_SAMPLED_INDICES;
    }

    const xAxisData: Record<AxisId, readonly (number | Date | string)[] | undefined> = {};
    rawXAxes?.forEach((axis) => {
      xAxisData[axis.id] = axis.data;
    });
    const yAxisData: Record<AxisId, readonly (number | Date | string)[] | undefined> = {};
    rawYAxes?.forEach((axis) => {
      yAxisData[axis.id] = axis.data;
    });

    return samplingState.computeSampledIndices({
      processedSeries,
      drawingArea,
      zoomLevel,
      xAxisData,
      yAxisData,
      defaultXAxisId,
      defaultYAxisId,
    });
  },
);

/**
 * Returns the render-only sampled indices keyed by series id. Empty when nothing is sampled. Read by
 * the plot hooks to skip dropped points; the series data itself stays untouched.
 */
export const useChartSampledIndices = (): Record<SeriesId, number[]> => {
  const store = useStore();
  return store.use(selectorChartSampledIndices);
};

const EMPTY_BAND_SAMPLING: { x: Record<AxisId, number[]>; y: Record<AxisId, number[]> } = {
  x: {},
  y: {},
};

/**
 * The sampled indices of bar series, grouped by the band axis they are laid out on (`x` for vertical
 * bars, `y` for horizontal bars). When several sampled series share a band axis, the first one wins —
 * they share the same uniform slot grid. Consumed by the axis highlight to align the highlighted band
 * with the (repositioned) sampled bar under the pointer.
 */
export const selectorChartBarSampledBandIndices = createSelectorMemoized(
  selectorChartSampledIndices,
  selectorChartSeriesProcessed,
  selectorChartDefaultXAxisId,
  selectorChartDefaultYAxisId,
  function selectorChartBarSampledBandIndices(
    sampledIndices,
    processedSeries,
    defaultXAxisId,
    defaultYAxisId,
  ): { x: Record<AxisId, number[]>; y: Record<AxisId, number[]> } {
    const barGroup = processedSeries.bar;
    if (!barGroup) {
      return EMPTY_BAND_SAMPLING;
    }

    const x: Record<AxisId, number[]> = {};
    const y: Record<AxisId, number[]> = {};

    for (const seriesId of barGroup.seriesOrder) {
      const indices = sampledIndices[seriesId];
      if (!indices) {
        continue;
      }
      const series = barGroup.series[seriesId];
      if (series.layout === 'horizontal') {
        const axisId = series.yAxisId ?? defaultYAxisId;
        if (!(axisId in y)) {
          y[axisId] = indices;
        }
      } else {
        const axisId = series.xAxisId ?? defaultXAxisId;
        if (!(axisId in x)) {
          x[axisId] = indices;
        }
      }
    }

    if (Object.keys(x).length === 0 && Object.keys(y).length === 0) {
      return EMPTY_BAND_SAMPLING;
    }
    return { x, y };
  },
);
