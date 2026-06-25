'use client';
import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { useChartGradientIdBuilder } from '../hooks/useChartGradientId';
import { isOrdinalScale } from '../internals/scaleGuards';
import type { ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  selectorChartSamplingState,
  selectorChartSamplingPyramids,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis/sampling.selectors';
import type { SampledBucket } from '../internals/plugins/featurePlugins/useChartCartesianAxis/sampling.types';
import {
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import { selectorChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeriesConfig';
import { useStore } from '../internals/store/useStore';
import { getCurveFactory } from '../internals/getCurve';
import type { ChartsXAxisProps, ChartsYAxisProps } from '../models';
import {
  getValueToPositionMapper,
  useDrawingArea,
  useLineSeriesContext,
  useXAxes,
  useYAxes,
} from '../hooks';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import type { SeriesId } from '../models/seriesType/common';

interface LinePlotDataPoint {
  d: string;
  seriesId: SeriesId;
  color: string;
  gradientId?: string;
  hidden: boolean;
  /** Skip the path animation: morphing between different sampled point counts looks wrong. */
  isSampled: boolean;
}

export function useLinePlotData(
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
) {
  const seriesData = useLineSeriesContext();
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];
  const getGradientId = useChartGradientIdBuilder();

  const drawingArea = useDrawingArea();
  const store = useStore();
  const samplingState = store.use(selectorChartSamplingState);
  const sampledSeries = store.use(selectorChartSamplingPyramids);
  const zoomMap = store.use(selectorChartZoomMap);
  const zoomOptions = store.use(selectorChartZoomOptionsLookup);
  const sampler = store.use(selectorChartSeriesConfig).line?.sampler;

  // Skip the line animation while sampling is on, plus the first render after it turns off: the
  // point count changes, so the path would morph.
  const lineMethod = samplingState?.methods.line;
  const samplingEnabled = lineMethod != null && lineMethod !== 'none';
  const wasSamplingEnabled = React.useRef(samplingEnabled);
  const skipSamplingAnimation = samplingEnabled || wasSamplingEnabled.current;
  React.useEffect(() => {
    wasSamplingEnabled.current = samplingEnabled;
  }, [samplingEnabled]);

  // This memo prevents odd line chart behavior when hydrating.
  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }

    const { series, stackingGroups } = seriesData;

    const linePlotData: LinePlotDataPoint[] = [];

    for (const stackingGroup of stackingGroups) {
      const groupIds = stackingGroup.ids;

      for (const seriesId of groupIds) {
        const {
          xAxisId = defaultXAxisId,
          yAxisId = defaultYAxisId,
          stackedData,
          visibleStackedData,
          data,
          connectNulls,
          curve,
          strictStepCurve,
        } = series[seriesId];

        if (!(xAxisId in xAxes) || !(yAxisId in yAxes)) {
          continue;
        }

        const xScale = xAxes[xAxisId].scale;
        const xPosition = getValueToPositionMapper(xScale);
        const yScale = yAxes[yAxisId].scale;
        const xData = xAxes[xAxisId].data;

        const gradientId: string | undefined =
          (yAxes[yAxisId].colorScale && getGradientId(yAxisId)) ||
          (xAxes[xAxisId].colorScale && getGradientId(xAxisId)) ||
          undefined;

        if (process.env.NODE_ENV !== 'production') {
          if (xData === undefined) {
            // TODO: fix mui/no-guarded-throw
            // eslint-disable-next-line mui/no-guarded-throw
            throw new Error(
              `MUI X Charts: ${
                xAxisId === DEFAULT_X_AXIS_KEY
                  ? 'The first `xAxis`'
                  : `The x-axis with id "${xAxisId}"`
              } should have a data property to be able to display a line plot. ` +
                'The x-axis data defines the positions for each point in the line. ' +
                'Provide a data array to the x-axis configuration.',
            );
          }
          if (xData.length < stackedData.length) {
            warnOnce(
              `MUI X Charts: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`,
              'error',
            );
          }
        }

        const shouldExpand = curve?.includes('step') && !strictStepCurve && isOrdinalScale(xScale);

        // Only the plain (non-step) path is sampled; step expansion falls back to the full render.
        const built = sampledSeries[seriesId];
        const zoom = zoomMap?.get(xAxisId);
        let sampledBuckets: SampledBucket[] | null = null;
        if (samplingEnabled && built && zoom && !shouldExpand && xData) {
          // Pro owns the sampling math; community flattens the buckets into a polyline.
          sampledBuckets =
            sampler?.sample?.({
              built,
              zoom,
              availableSize: drawingArea.width,
              minSpan: zoomOptions[xAxisId]?.minSpan ?? 0,
              algorithm: lineMethod,
              getValues: () => Float64Array.from(visibleStackedData, (point) => point[1]),
            }) ?? null;
        }

        type FormattedPoint = {
          x: any;
          y: [number, number];
          nullData: boolean;
          isExtension?: boolean;
        };

        let formattedData: FormattedPoint[];
        if (sampledBuckets) {
          // Buckets already hold the indices to render; flatten them.
          formattedData = sampledBuckets.flatMap((bucket) =>
            Array.from(bucket.indices, (index) => ({
              x: xData![index],
              y: visibleStackedData[index],
              nullData: data[index] == null,
            })),
          );
        } else {
          formattedData =
            xData?.flatMap((x, index) => {
              const nullData = data[index] == null;
              if (shouldExpand) {
                const rep = [{ x, y: visibleStackedData[index], nullData, isExtension: false }];
                if (!nullData && (index === 0 || data[index - 1] == null)) {
                  rep.unshift({
                    x: (xScale(x) ?? 0) - (xScale.step() - xScale.bandwidth()) / 2,
                    y: visibleStackedData[index],
                    nullData,
                    isExtension: true,
                  });
                }
                if (!nullData && (index === data.length - 1 || data[index + 1] == null)) {
                  rep.push({
                    x: (xScale(x) ?? 0) + (xScale.step() + xScale.bandwidth()) / 2,
                    y: visibleStackedData[index],
                    nullData,
                    isExtension: true,
                  });
                }
                return rep;
              }
              return { x, y: visibleStackedData[index], nullData };
            }) ?? [];
        }

        const d3Data = connectNulls ? formattedData.filter((d) => !d.nullData) : formattedData;
        const hidden = series[seriesId].hidden;

        const linePath = d3Line<FormattedPoint>()
          .x((d) => (d.isExtension ? d.x : xPosition(d.x)))
          .defined((d) => connectNulls || !d.nullData || !!d.isExtension)
          .y((d) => {
            if (hidden) {
              return yScale(d.y[0])!;
            }

            return yScale(d.y[1])!;
          });

        const d = linePath.curve(getCurveFactory(curve))(d3Data) || '';
        linePlotData.push({
          color: series[seriesId].color,
          gradientId,
          d,
          seriesId,
          hidden: series[seriesId].hidden,
          isSampled: skipSamplingAnimation,
        });
      }
    }

    return linePlotData;
  }, [
    seriesData,
    defaultXAxisId,
    defaultYAxisId,
    xAxes,
    yAxes,
    getGradientId,
    drawingArea,
    samplingEnabled,
    lineMethod,
    sampledSeries,
    zoomMap,
    zoomOptions,
    sampler,
    skipSamplingAnimation,
  ]);

  return allData;
}
