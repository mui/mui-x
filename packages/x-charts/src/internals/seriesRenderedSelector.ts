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
 * A quantized zoom level: `0` when not zoomed, +1 each time the visible range roughly halves,
 * measured against the axis's zoom extent (`maxEnd - minStart`). Being a primitive, it lets the
 * sampler below recompute only when the level changes — not every pan frame — so the sampled shape
 * stays stable while panning.
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
        level = Math.max(level, Math.floor(Math.log2(fullRange / span)));
      }
    });
    return level;
  },
);

const EMPTY_SAMPLED_INDICES: Record<SeriesId, number[]> = {};

/**
 * Render-only sampled indices per series id: a sidecar that only the plot hooks read, leaving the
 * series data (and so extremums, tooltips, highlight, interaction) untouched. The algorithm lives in
 * the Pro package — this selector gathers the inputs and delegates to the `computeSampledIndices`
 * function the Pro plugin puts in the store; without it, nothing is sampled.
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
 * Target spacing (px) between rendered points, matching the Pro sampler default. Duplicated here
 * because the community package cannot depend on the Pro package.
 */
const PIXELS_PER_POINT = 4;

/**
 * Adds the dropped points back once the visible range is zoomed in far enough that they all fit the
 * render budget, so the user sees real data instead of an approximation (bounded to the drawing
 * area). Line and bar use a contiguous index window; scatter uses a pixel test.
 *
 * A cheap pan-aware layer over `selectorChartSampledIndices` (which stays quantized and stable): it
 * only re-slices the visible subset, and returns the sampled result unchanged when not zoomed.
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
    if (!samplingState || zoomLevel <= 0) {
      return sampledIndices;
    }

    const renderBudget = (pixelSpan: number, length: number) =>
      Math.min(length, Math.max(2, Math.floor(pixelSpan / PIXELS_PER_POINT)) * 2 ** zoomLevel);

    // `null` when the axis is not zoomed, so its whole extent is visible.
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

    // Line and bar are index-ordered, so a contiguous index window matches the visible range.
    (['line', 'bar'] as const).forEach((type) => {
      const group = processedSeries[type] as
        | { series: Record<string, any>; seriesOrder: string[] }
        | undefined;
      if (!group) {
        return;
      }

      for (const seriesId of group.seriesOrder) {
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

        if (windowLength > 0 && windowLength <= target) {
          const indices = new Array<number>(windowLength);
          for (let i = 0; i < windowLength; i += 1) {
            indices[i] = start + i;
          }
          assign(seriesId, indices);
        }
      }
    });

    // Scatter is not index-ordered, so visibility is a pixel test (the same one the plot uses for
    // `isPointInside`) rather than an index window.
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
 * Whether a series' render indices are a contiguous run — the shape the deep-zoom override produces,
 * versus an always-sparse downsample. Bars use it to render such a window at real band positions
 * instead of the uniform sampled slots (and the axis highlight to pick the matching path).
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
 * Sampled bar indices grouped by their band axis (`x` for vertical, `y` for horizontal bars), the
 * first sampled series winning per axis. Consumed by the axis highlight to align the highlighted
 * band with the repositioned sampled bar under the pointer.
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
      // Windowed (show-all) bars render at real band positions, so they use the normal band
      // highlight, not the slot-aligned path.
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
