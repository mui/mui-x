import { createSelectorMemoized } from '@mui/x-internals/store';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { selectorChartSeriesConfig } from '../../corePlugins/useChartSeriesConfig';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { AxisId } from '../../../../models/axis';
import type { ChartRootSelector } from '../../utils/selectors';
import type { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import type { SampledSeriesLookup } from './sampling.types';
import {
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from './useChartCartesianAxisRendering.selectors';

const EMPTY_PYRAMIDS: SampledSeriesLookup = {};
const EMPTY_BUCKET_SIZES: Map<AxisId, number> = new Map();

export const selectorChartSamplingState: ChartRootSelector<
  UseChartCartesianAxisSignature,
  'sampling'
> = (state) => state.sampling;

/**
 * Built sampling structures per series, keyed by series id. Rebuilt only on data change (memoized).
 * Iterates every series type whose `seriesConfig` registers a `sampler` (bar, line, …); the
 * type-specific plot hook reads the structure back and renders the active level of detail.
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
 * Merged bucket size per band axis, used to widen the axis highlight over a sampled bucket.
 * Returns `1` (no entry) when sampling is off or no sampler is registered (community build).
 * The bucket-size math lives in the pro sampler; community only reads the resulting integers.
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
        const zoom = zoomMap?.get(axisId);
        const minSpan = zoomOptions[axisId]?.minSpan;
        if (data && zoom && minSpan != null) {
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
