import type { ChartSampledIndicesInput, SeriesId } from '@mui/x-charts/internals';
import { samplerRegistry } from './samplerRegistry';
import { type ChartSeriesSamplerContext } from './sampler.types';

/**
 * Computes the render-only sampled indices for every series that sets a `sampling` method.
 *
 * Provided to the store by the Pro sampling plugin and called by the community sampled-indices
 * selector. Runs in data space, driven by the quantized zoom level, so the kept set is stable while
 * panning. The series objects are never mutated — the result is a sidecar map keyed by series id.
 *
 * @param {ChartSampledIndicesInput} input The processed series and geometry to sample against.
 * @returns {Record<SeriesId, number[]>} The indices to render, keyed by series id.
 */
export function computeSampledIndices(input: ChartSampledIndicesInput): Record<SeriesId, number[]> {
  const {
    processedSeries,
    drawingArea,
    zoomLevel,
    xAxisData,
    yAxisData,
    defaultXAxisId,
    defaultYAxisId,
  } = input;

  const result: Record<SeriesId, number[]> = {};

  (Object.keys(processedSeries) as (keyof typeof processedSeries)[]).forEach((type) => {
    const sampler = samplerRegistry[type] as
      | ((series: unknown, context: ChartSeriesSamplerContext) => number[] | null)
      | undefined;
    // The heterogeneous ProcessedSeries union does not narrow per key, so we work loosely here.
    const group = processedSeries[type] as
      | { series: Record<string, any>; seriesOrder: string[] }
      | undefined;
    if (!sampler || !group) {
      return;
    }

    const buildContext = (series: any): ChartSeriesSamplerContext => ({
      drawingArea,
      zoomLevel,
      xData: xAxisData[series.xAxisId ?? defaultXAxisId],
      yData: yAxisData[series.yAxisId ?? defaultYAxisId],
    });

    const stackingGroups = (group as { stackingGroups?: { ids: string[] }[] }).stackingGroups;

    if (Array.isArray(stackingGroups)) {
      // Stacked series must keep the SAME indices to stay aligned, so each stacking group is sampled
      // once and the result is shared by every member. Unstacked series are singleton groups, so
      // this also covers the non-stacked case.
      for (const stack of stackingGroups) {
        const ids = stack.ids.filter((id) => group.series[id]);
        const samplingId = ids.find((id) => group.series[id].sampling);
        if (!samplingId) {
          continue;
        }
        // Sample the representative member directly — its already-computed `visibleStackedData` is
        // the cumulative stack position — then share the indices with every member.
        const context = buildContext(group.series[samplingId]);
        const indices = sampler(group.series[samplingId], context);
        if (indices) {
          for (const id of ids) {
            result[id] = indices;
          }
        }
      }
    } else {
      for (const seriesId of group.seriesOrder) {
        const series = group.series[seriesId];
        if (!series || !series.sampling) {
          continue;
        }
        const context = buildContext(series);
        const indices = sampler(series, context);
        if (indices) {
          result[seriesId] = indices;
        }
      }
    }
  });

  return result;
}
