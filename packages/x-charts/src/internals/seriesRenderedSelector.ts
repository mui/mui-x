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
  selectorChartXScales,
  selectorChartYScales,
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
 * time the visible range roughly halves. The level is measured against the axis's full zoom extent
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
 * The target spacing (in pixels) between rendered points, matching the Pro sampler default. Used to
 * size the render budget for the "show every visible point" check below. Duplicated here (rather than
 * imported from the Pro package, which the community package cannot depend on) so the deep-zoom
 * override stays cheap and lives next to its only consumers.
 */
const PIXELS_PER_POINT = 4;

/**
 * Layers a "show every visible point" pass on top of the stable sampled indices.
 *
 * Once the visible range has been zoomed in far enough that every point inside it fits within the
 * render budget, the dropped points are added back so the user sees the real, full-resolution data
 * instead of an approximation — only the points still inside the (clipped) drawing area are
 * rendered, so the count stays bounded. Line and bar use a contiguous index window (the data index
 * follows the axis position); scatter, which is not position-ordered, filters by the visible x/y
 * value rectangle instead.
 *
 * The expensive sampling stays in `selectorChartSampledIndices` (driven by the quantized zoom level,
 * so it is stable while panning). This layer only re-slices the visible subset, so it is cheap even
 * though it follows the pan position. When not zoomed it returns the sampled result unchanged (same
 * reference), so the common case pays nothing.
 */
export const selectorChartSampledIndicesVisible = createSelectorMemoized(
  selectorChartSampledIndices,
  selectorChartSeriesProcessed,
  selectorChartXScales,
  selectorChartYScales,
  selectorChartSamplingState,
  selectorChartDrawingArea,
  selectorChartSamplingZoomLevel,
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
  selectorChartDefaultXAxisId,
  selectorChartDefaultYAxisId,
  function selectorChartSampledIndicesVisible(
    sampledIndices,
    processedSeries,
    xScales,
    yScales,
    samplingState,
    drawingArea,
    zoomLevel,
    zoomMap,
    optionsLookup,
    defaultXAxisId,
    defaultYAxisId,
  ): Record<SeriesId, number[]> {
    // Nothing sampled, or not zoomed in: the sampled result already covers everything.
    if (!samplingState || zoomLevel <= 0) {
      return sampledIndices;
    }

    const renderBudget = (pixelSpan: number, length: number) =>
      Math.min(length, Math.max(2, Math.floor(pixelSpan / PIXELS_PER_POINT)) * 2 ** zoomLevel);

    // The visible data window of an axis, as a `[start, end]` fraction of its full zoom extent.
    // `null` when the axis is not zoomed (so its whole extent is visible).
    const visibleWindow = (axisId: AxisId): { start: number; end: number } | null => {
      const zoom = zoomMap?.get(axisId);
      if (!zoom) {
        return null;
      }
      const options = optionsLookup[axisId];
      const minStart = options?.minStart ?? 0;
      const maxEnd = options?.maxEnd ?? 100;
      const full = maxEnd - minStart;
      if (full <= 0) {
        return null;
      }
      return { start: (zoom.start - minStart) / full, end: (zoom.end - minStart) / full };
    };

    let result = sampledIndices;
    const assign = (seriesId: SeriesId, indices: number[]) => {
      if (result === sampledIndices) {
        result = { ...sampledIndices };
      }
      result[seriesId] = indices;
    };

    // Line and bar are index-ordered (data index follows the axis position), so a contiguous index
    // window matches the visible range.
    (['line', 'bar'] as const).forEach((type) => {
      const group = processedSeries[type] as
        | { series: Record<string, any>; seriesOrder: string[] }
        | undefined;
      if (!group) {
        return;
      }

      for (const seriesId of group.seriesOrder) {
        // Only series that were actually downsampled can be restored.
        if (!sampledIndices[seriesId]) {
          continue;
        }
        const series = group.series[seriesId];
        const horizontal = series.layout === 'horizontal';
        const axisId = horizontal
          ? (series.yAxisId ?? defaultYAxisId)
          : (series.xAxisId ?? defaultXAxisId);
        const window = visibleWindow(axisId);
        if (!window) {
          continue;
        }

        const length = (series.visibleStackedData ?? series.data)?.length ?? 0;
        const target = renderBudget(horizontal ? drawingArea.height : drawingArea.width, length);

        const start = Math.max(0, Math.floor(window.start * length));
        const end = Math.min(length, Math.ceil(window.end * length));
        const windowLength = end - start;

        // Show every visible point only once they all fit within the render budget.
        if (windowLength > 0 && windowLength <= target) {
          const indices = new Array<number>(windowLength);
          for (let i = 0; i < windowLength; i += 1) {
            indices[i] = start + i;
          }
          assign(seriesId, indices);
        }
      }
    });

    // Scatter is not index-ordered, so the visible region is a value rectangle rather than an index
    // window. Project each point through the zoom-aware scales and keep the ones whose pixel falls
    // inside the drawing area — the same on-screen test the scatter plot itself uses — once few
    // enough remain.
    const scatterGroup = processedSeries.scatter as
      | { series: Record<string, any>; seriesOrder: string[] }
      | undefined;
    if (scatterGroup) {
      const minX = drawingArea.left;
      const maxX = drawingArea.left + drawingArea.width;
      const minY = drawingArea.top;
      const maxY = drawingArea.top + drawingArea.height;

      for (const seriesId of scatterGroup.seriesOrder) {
        if (!sampledIndices[seriesId]) {
          continue;
        }
        const series = scatterGroup.series[seriesId];
        const xScale = xScales[series.xAxisId ?? defaultXAxisId];
        const yScale = yScales[series.yAxisId ?? defaultYAxisId];
        if (!xScale || !yScale) {
          continue;
        }

        const data = series.data as { x: number; y: number }[];
        const target = renderBudget(drawingArea.width, data.length);

        const indices: number[] = [];
        let overBudget = false;
        for (let i = 0; i < data.length; i += 1) {
          const px = xScale(data[i].x);
          const py = yScale(data[i].y);
          if (
            px !== undefined &&
            py !== undefined &&
            px >= minX &&
            px <= maxX &&
            py >= minY &&
            py <= maxY
          ) {
            indices.push(i);
            if (indices.length > target) {
              overBudget = true;
              break;
            }
          }
        }

        if (!overBudget && indices.length > 0) {
          assign(seriesId, indices);
        }
      }
    }

    return result;
  },
);

/**
 * Whether a series' render indices are a contiguous run — the shape the deep-zoom override produces
 * when it restores every visible point (a bucket or LTTB sample is always sparse). Bars use this to
 * render such a window at their real band positions instead of the uniform sampled slots, and the
 * axis highlight uses it to fall back to the normal band path.
 */
export const isContiguousSampling = (indices: number[]): boolean =>
  indices.length > 0 && indices[indices.length - 1] - indices[0] === indices.length - 1;

/**
 * Returns the render-only sampled indices keyed by series id. Empty when nothing is sampled. Read by
 * the plot hooks to skip dropped points; the series data itself stays untouched.
 */
export const useChartSampledIndices = (): Record<SeriesId, number[]> => {
  const store = useStore();
  return store.use(selectorChartSampledIndicesVisible);
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
  selectorChartSampledIndicesVisible,
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
      // Windowed (show-all) bars render at real band positions, so the normal band highlight
      // applies — they must not go through the slot-aligned highlight path.
      if (!indices || isContiguousSampling(indices)) {
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
