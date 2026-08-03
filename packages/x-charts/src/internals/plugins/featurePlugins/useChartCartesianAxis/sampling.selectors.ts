import { createSelectorMemoized } from '@mui/x-internals/store';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { selectorChartSeriesConfig } from '../../corePlugins/useChartSeriesConfig';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { AxisId } from '../../../../models/axis';
import type { ChartRootSelector } from '../../utils/selectors';
import type { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import type { SampledSeriesLookup } from './sampling.types';
import type { ZoomData } from './zoom.types';
import {
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from './useChartCartesianAxisRendering.selectors';

const EMPTY_PYRAMIDS: SampledSeriesLookup = {};
const EMPTY_BUCKET_SIZES: Map<AxisId, number> = new Map();

/**
 * Full-range zoom (span 100%) for a non-zoomable axis. Sampling gates on a zoom entry; a static axis
 * has none, so we sample it at full range — the `MAX_RENDERED_POINTS` cap still applies. Mirrors the
 * full-range zoom the zoom-slider preview uses to keep its density stable.
 */
export function getFullRangeZoom(axisId: AxisId): ZoomData {
  return { axisId, start: 0, end: 100 };
}

export const selectorChartSamplingState: ChartRootSelector<
  UseChartCartesianAxisSignature,
  'sampling'
> = (state) => state.sampling;

/**
 * Built sampling structures keyed by series id. Memoized, so rebuilt only on data change. Builds
 * only for series types that are enabled and register a `sampler`; the plot hook reads them back.
 */
export const selectorChartSamplingPyramids = createSelectorMemoized(
  selectorChartSamplingState,
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  function selectorChartSamplingPyramids(
    samplingState,
    processedSeries,
    seriesConfig,
  ): SampledSeriesLookup {
    if (!samplingState?.enabled) {
      return EMPTY_PYRAMIDS;
    }

    let sampled: SampledSeriesLookup | undefined;
    (Object.keys(processedSeries) as ChartSeriesType[]).forEach((seriesType) => {
      const method = samplingState.methods[seriesType];
      if (!method || method === 'none') {
        return;
      }
      const sampler = seriesConfig[seriesType]?.sampler;
      const typeData = processedSeries[seriesType];
      if (!sampler || !typeData) {
        return;
      }

      for (const seriesId of typeData.seriesOrder) {
        const built = sampler.build(typeData.series[seriesId] as never);
        if (built) {
          sampled ??= {};
          sampled[seriesId] = built;
        }
      }
    });

    return sampled ?? EMPTY_PYRAMIDS;
  },
);

/**
 * Merged bucket size per band axis, to widen the axis highlight over a sampled bucket. Empty when
 * sampling is off or no sampler is registered. The math lives in pro; community reads the integers.
 */
export const selectorChartHighlightBucketSize = createSelectorMemoized(
  selectorChartSamplingState,
  selectorChartZoomMap,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartDrawingArea,
  selectorChartZoomOptionsLookup,
  selectorChartSeriesConfig,
  function selectorChartHighlightBucketSize(
    samplingState,
    zoomMap,
    xAxis,
    yAxis,
    drawingArea,
    zoomOptions,
    seriesConfig,
  ): Map<AxisId, number> {
    if (!samplingState?.enabled) {
      return EMPTY_BUCKET_SIZES;
    }
    const bucketSizeAt =
      seriesConfig.bar?.sampler?.bucketSizeAt ?? seriesConfig.line?.sampler?.bucketSizeAt;
    if (!bucketSizeAt) {
      return EMPTY_BUCKET_SIZES;
    }

    const bucketSizes = new Map<AxisId, number>();
    (
      [
        [xAxis, drawingArea.width],
        [yAxis, drawingArea.height],
      ] as const
    ).forEach(([axes, availableSize]) => {
      axes.axisIds.forEach((axisId) => {
        const data = axes.axis[axisId].data;
        const zoom = zoomMap?.get(axisId) ?? getFullRangeZoom(axisId);
        const minSpan = zoomOptions[axisId]?.minSpan ?? 0;
        if (data) {
          bucketSizes.set(
            axisId,
            bucketSizeAt(zoom.end - zoom.start, {
              dataLength: data.length,
              availableSize,
              minSpan,
            }),
          );
        }
      });
    });
    return bucketSizes;
  },
);
