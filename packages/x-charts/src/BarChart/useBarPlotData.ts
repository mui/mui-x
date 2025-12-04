import { type ChartsXAxisProps, type ChartsYAxisProps, type ComputedAxis } from '../models/axis';
import getColor from './seriesConfig/bar/getColor';
import { type ChartDrawingArea, useChartId, useXAxes, useYAxes } from '../hooks';
import { type MaskData, type ProcessedBarData, type ProcessedBarSeriesData } from './types';
import { checkBarChartScaleErrors } from './checkBarChartScaleErrors';
import { useBarSeriesContext } from '../hooks/useBarSeries';
import { type SeriesProcessorResult } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';
import { type ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types';
import { getBarDimensions } from '../internals/getBarDimensions';
import {
  selectorIsIdentifierVisibleGetter,
  type UseChartVisibilityManagerSignature,
} from '../internals/plugins/featurePlugins/useChartVisibilityManager';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';

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
  const store = useStore<[UseChartVisibilityManagerSignature]>();
  const isItemVisible = useSelector(store, selectorIsIdentifierVisibleGetter).get;

  const chartId = useChartId();

  const { series, stackingGroups } = seriesData;

  const masks: Record<string, MaskData> = {};

  const data = stackingGroups.flatMap(({ ids: seriesIds }, groupIndex) => {
    const xMin = drawingArea.left;
    const xMax = drawingArea.left + drawingArea.width;

    const yMin = drawingArea.top;
    const yMax = drawingArea.top + drawingArea.height;

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
        series[seriesId].fullStackedData.length,
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
      for (let dataIndex = 0; dataIndex < baseScaleConfig.data!.length; dataIndex += 1) {
        const barDimensions = getBarDimensions({
          verticalLayout,
          xAxisConfig,
          yAxisConfig,
          series: series[seriesId],
          dataIndex,
          numberOfGroups: stackingGroups.length,
          groupIndex,
          isItemVisible,
        });

        if (barDimensions == null) {
          continue;
        }

        const stackId = series[seriesId].stack;

        const result = {
          seriesId,
          dataIndex,
          layout: series[seriesId].layout,
          hidden: series[seriesId].hidden,
          ...barDimensions,
          color: colorGetter(dataIndex),
          value: series[seriesId].data[dataIndex],
          maskId: `${chartId}_${stackId || seriesId}_${groupIndex}_${dataIndex}`,
        };

        if (
          result.x > xMax ||
          result.x + result.width < xMin ||
          result.y > yMax ||
          result.y + result.height < yMin
        ) {
          continue;
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
