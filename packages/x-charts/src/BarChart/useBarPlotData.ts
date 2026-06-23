import {
  type AxisId,
  type ChartsXAxisProps,
  type ChartsYAxisProps,
  type ComputedAxis,
} from '../models/axis';
import getColor from './seriesConfig/bar/getColor';
import { useXAxes, useYAxes } from '../hooks/useAxis';
import { type MaskData, type ProcessedBarData, type ProcessedBarSeriesData } from './types';
import { checkBarChartScaleErrors } from './checkBarChartScaleErrors';
import { useBarSeriesContext } from '../hooks/useBarSeries';
import type { SeriesProcessorResult } from '../internals/plugins/corePlugins/useChartSeriesConfig';
import { type ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types';
import { createGetBarDimensions } from '../internals/createGetBarDimensions';
import { type ChartDrawingArea } from '../hooks/useDrawingArea';
import { useChartId } from '../hooks/useChartId';
import { useStore } from '../internals/store/useStore';
import { selectorChartSamplingPyramids } from '../internals/plugins/featurePlugins/useChartCartesianAxis/sampling.selectors';
import type {
  SampledSeriesLookup,
  SamplingStrategy,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis/sampling.types';
import { selectorChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeriesConfig';
import {
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import type { ZoomData } from '../internals/plugins/featurePlugins/useChartCartesianAxis/zoom.types';
import type { ChartSeriesDefaultized } from '../models/seriesType/config';
import type { StackingGroupsType } from '../internals/stacking';
import { type SeriesId } from '../models/seriesType';

export function useBarPlotData(
  drawingArea: ChartDrawingArea,
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
): {
  completedData: ProcessedBarSeriesData[];
  masksData: MaskData[];
} {
  const seriesData =
    useBarSeriesContext() ??
    ({ series: {}, stackingGroups: [], seriesOrder: [] } as SeriesProcessorResult<'bar'>);
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];

  const chartId = useChartId();

  const store = useStore();
  const samplingPyramids = store.use(selectorChartSamplingPyramids);
  const zoomMap = store.use(selectorChartZoomMap);
  const zoomOptions = store.use(selectorChartZoomOptionsLookup);
  const sampler = store.use(selectorChartSeriesConfig).bar?.sampler;

  return processBarDataForPlot(
    drawingArea,
    chartId,
    seriesData.stackingGroups,
    seriesData.series,
    xAxes,
    yAxes,
    defaultXAxisId,
    defaultYAxisId,
    samplingPyramids,
    zoomMap,
    sampler,
    zoomOptions,
  );
}

export function processBarDataForPlot(
  drawingArea: ChartDrawingArea,
  chartId: string | undefined,
  stackingGroups: StackingGroupsType,
  series: Record<SeriesId, ChartSeriesDefaultized<'bar'>>,
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
  defaultXAxisId: AxisId,
  defaultYAxisId: AxisId,
  samplingPyramids: SampledSeriesLookup = {},
  zoomMap?: Map<AxisId, ZoomData>,
  sampler?: SamplingStrategy<'bar'>,
  zoomOptions?: Record<AxisId, { minSpan: number }>,
) {
  const masks: Record<string, MaskData> = {};

  const data = stackingGroups.flatMap(({ ids: seriesIds }, groupIndex) => {
    const xMin = drawingArea.left;
    const xMax = drawingArea.left + drawingArea.width;

    const yMin = drawingArea.top;
    const yMax = drawingArea.top + drawingArea.height;
    const lastNegativePerIndex = new Map<number, ProcessedBarData>();
    const lastPositivePerIndex = new Map<number, ProcessedBarData>();

    return seriesIds.map((seriesId) => {
      const xAxisId = series[seriesId].xAxisId ?? defaultXAxisId;
      const yAxisId = series[seriesId].yAxisId ?? defaultYAxisId;
      const layout = series[seriesId].layout;

      const xAxisConfig = xAxes[xAxisId];
      const yAxisConfig = yAxes[yAxisId];

      const verticalLayout = series[seriesId].layout === 'vertical';
      const reverse = (verticalLayout ? yAxisConfig.reverse : xAxisConfig.reverse) ?? false;

      checkBarChartScaleErrors(
        verticalLayout,
        seriesId,
        series[seriesId].stackedData.length,
        xAxisId,
        xAxes,
        yAxisId,
        yAxes,
      );

      const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;

      const xScale = xAxisConfig.scale;
      const yScale = yAxisConfig.scale;
      const xOrigin = Math.round(xScale(0) ?? 0);
      const yOrigin = Math.round(yScale(0) ?? 0);

      const colorGetter = getColor(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);
      const stackId = series[seriesId].stack;

      const seriesDataPoints: ProcessedBarData[] = [];

      // Culls off-screen bars then records the bar's border-radius side and mask contribution.
      const registerResult = (result: ProcessedBarData, dataIndex: number) => {
        if (
          result.x > xMax ||
          result.x + result.width < xMin ||
          result.y > yMax ||
          result.y + result.height < yMin
        ) {
          return;
        }

        const lastNegative = lastNegativePerIndex.get(dataIndex);
        const lastPositive = lastPositivePerIndex.get(dataIndex);
        const sign = (reverse ? -1 : 1) * Math.sign(result.value ?? 0);
        if (sign > 0) {
          if (lastPositive) {
            delete lastPositive.borderRadiusSide;
          }

          result.borderRadiusSide = verticalLayout ? 'top' : 'right';
          lastPositivePerIndex.set(dataIndex, result);
        } else if (sign < 0) {
          if (lastNegative) {
            delete lastNegative.borderRadiusSide;
          }

          result.borderRadiusSide = verticalLayout ? 'bottom' : 'left';
          lastNegativePerIndex.set(dataIndex, result);
        }

        if (!masks[result.maskId]) {
          masks[result.maskId] = {
            id: result.maskId,
            width: 0,
            height: 0,
            hasNegative: false,
            hasPositive: false,
            layout,
            xOrigin,
            yOrigin,
            x: 0,
            y: 0,
          };
        }

        const mask = masks[result.maskId];
        mask.width = layout === 'vertical' ? result.width : mask.width + result.width;
        mask.height = layout === 'vertical' ? mask.height + result.height : result.height;
        mask.x = Math.min(mask.x === 0 ? Infinity : mask.x, result.x);
        mask.y = Math.min(mask.y === 0 ? Infinity : mask.y, result.y);

        const value = result.value ?? 0;
        mask.hasNegative = mask.hasNegative || (reverse ? value > 0 : value < 0);
        mask.hasPositive = mask.hasPositive || (reverse ? value < 0 : value > 0);

        seriesDataPoints.push(result);
      };

      const makeResult = (
        dataIndex: number,
        barDimensions: { x: number; y: number; width: number; height: number },
      ): ProcessedBarData => ({
        seriesId,
        dataIndex,
        hidden: series[seriesId].hidden,
        ...barDimensions,
        color: colorGetter(dataIndex),
        value: series[seriesId].data[dataIndex],
        maskId: `${chartId}_${stackId || seriesId}_${groupIndex}_${dataIndex}`,
      });

      const pyramid = samplingPyramids[seriesId];
      const baseAxisId = verticalLayout ? xAxisId : yAxisId;
      const zoom = zoomMap?.get(baseAxisId);
      const availableSize = verticalLayout ? drawingArea.width : drawingArea.height;
      const minSpan = zoomOptions?.[baseAxisId]?.minSpan ?? 0;
      // The sampler (pro) owns all sampling math; community only renders its output.
      const sampledBars =
        pyramid && zoom && sampler?.sampleBars
          ? sampler.sampleBars({
              built: pyramid,
              series: series[seriesId],
              zoom,
              availableSize,
              minSpan,
              verticalLayout,
              xAxisConfig,
              yAxisConfig,
              numberOfGroups: stackingGroups.length,
              groupIndex,
            })
          : null;

      if (sampledBars) {
        for (const bar of sampledBars) {
          registerResult(makeResult(bar.dataIndex, bar), bar.dataIndex);
        }
      } else {
        const getBarDimensions = createGetBarDimensions({
          verticalLayout,
          xAxisConfig,
          yAxisConfig,
          series: series[seriesId],
          numberOfGroups: stackingGroups.length,
        });

        // Narrow to the visible index window so panning/zoom doesn't compute every off-screen bar.
        // `firstIndex`/`lastIndex` bound the band axis range; the cull in `registerResult` stays
        // exact. A 1-bucket margin covers grouped-bar offsets and partial edge bars.
        const baseData = baseScaleConfig.data!;
        const dataLength = baseData.length;
        let firstIndex = 0;
        let lastIndex = dataLength - 1;
        if (dataLength > 1) {
          const baseScale = baseScaleConfig.scale;
          const p0 = baseScale(baseData[0])!;
          const slope = baseScale(baseData[1])! - p0; // signed px per index (handles reversed axis)
          if (slope !== 0) {
            const winLo = verticalLayout ? xMin : yMin;
            const winHi = verticalLayout ? xMax : yMax;
            const ia = (winLo - p0) / slope;
            const ib = (winHi - p0) / slope;
            firstIndex = Math.max(0, Math.floor(Math.min(ia, ib)) - 1);
            lastIndex = Math.min(dataLength - 1, Math.ceil(Math.max(ia, ib)) + 1);
          }
        }

        for (let dataIndex = firstIndex; dataIndex <= lastIndex; dataIndex += 1) {
          const barDimensions = getBarDimensions(dataIndex, groupIndex);

          if (barDimensions == null) {
            continue;
          }

          registerResult(makeResult(dataIndex, barDimensions), dataIndex);
        }
      }

      return {
        seriesId,
        barLabel: series[seriesId].barLabel,
        barLabelPlacement: series[seriesId].barLabelPlacement,
        data: seriesDataPoints,
        layout,
        xOrigin,
        yOrigin,
      };
    });
  });

  return {
    completedData: data,
    masksData: Object.values(masks),
  };
}
