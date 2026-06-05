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
import type { ChartSeriesDefaultized } from '../models/seriesType/config';
import type { StackingGroupsType } from '../internals/stacking';
import { type SeriesId } from '../models/seriesType';
import { useChartSampledIndices, isContiguousSampling } from '../internals/seriesRenderedSelector';
import { getBarSampledSlots, getBarSampledSlotPosition } from '../internals/barSampledSlot';

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
  const sampledIndicesBySeries = useChartSampledIndices();

  return processBarDataForPlot(
    drawingArea,
    chartId,
    seriesData.stackingGroups,
    seriesData.series,
    sampledIndicesBySeries,
    xAxes,
    yAxes,
    defaultXAxisId,
    defaultYAxisId,
  );
}

export function processBarDataForPlot(
  drawingArea: ChartDrawingArea,
  chartId: string | undefined,
  stackingGroups: StackingGroupsType,
  series: Record<SeriesId, ChartSeriesDefaultized<'bar'>>,
  sampledIndicesBySeries: Record<SeriesId, number[]>,
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
  defaultXAxisId: AxisId,
  defaultYAxisId: AxisId,
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

      const seriesDataPoints: ProcessedBarData[] = [];
      const getBarDimensions = createGetBarDimensions({
        verticalLayout,
        xAxisConfig,
        yAxisConfig,
        series: series[seriesId],
        numberOfGroups: stackingGroups.length,
      });

      const sampledIndices = sampledIndicesBySeries[seriesId];
      const barCount = sampledIndices ? sampledIndices.length : baseScaleConfig.data!.length;

      // Downsampled bars are laid on a uniform slot grid (fewer, wider, evenly filling the axis)
      // rather than their sparse real positions. A contiguous window is the show-all case: those
      // bars keep their true positions, since slotting a visible subset across the whole range would
      // shift and resize them as the override kicks in.
      const slots =
        sampledIndices && !isContiguousSampling(sampledIndices)
          ? getBarSampledSlots(baseScaleConfig.scale.range(), barCount)
          : null;

      // Slot position is linear in the cursor, so under zoom (where the band range is extended past
      // the drawing area) most slots fall off-screen. Iterate only the visible cursor window instead
      // of all `barCount` bars — otherwise a deeply-zoomed large series builds and culls hundreds of
      // thousands of off-screen bars every frame.
      let cursorStart = 0;
      let cursorEnd = barCount;
      if (slots && slots.step !== 0) {
        const visibleMin = verticalLayout ? xMin : yMin;
        const visibleMax = verticalLayout ? xMax : yMax;
        const a = (visibleMin - slots.range[0]) / slots.step;
        const b = (visibleMax - slots.range[0]) / slots.step;
        cursorStart = Math.max(0, Math.floor(Math.min(a, b)) - 1);
        cursorEnd = Math.min(barCount, Math.ceil(Math.max(a, b)) + 2);
      }

      for (let cursor = cursorStart; cursor < cursorEnd; cursor += 1) {
        const dataIndex = sampledIndices ? sampledIndices[cursor] : cursor;
        const barDimensions = getBarDimensions(dataIndex, groupIndex);

        if (barDimensions == null) {
          continue;
        }

        const stackId = series[seriesId].stack;

        const result: ProcessedBarData = {
          seriesId,
          dataIndex,
          hidden: series[seriesId].hidden,
          ...barDimensions,
          color: colorGetter(dataIndex),
          value: series[seriesId].data[dataIndex],
          maskId: `${chartId}_${stackId || seriesId}_${groupIndex}_${dataIndex}`,
        };

        if (slots) {
          const { position, thickness } = getBarSampledSlotPosition(slots, cursor);
          if (verticalLayout) {
            result.x = position;
            result.width = thickness;
          } else {
            result.y = position;
            result.height = thickness;
          }
        }

        if (
          result.x > xMax ||
          result.x + result.width < xMin ||
          result.y > yMax ||
          result.y + result.height < yMin
        ) {
          continue;
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
