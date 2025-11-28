import { createSelector } from '@mui/x-internals/store';
import {
  ChartItemIdentifierWithData,
  ChartSeriesDefaultized,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import {
  ProcessedSeries,
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { TooltipPositionGetterAxesConfig } from '../../models/seriesConfig/tooltipItemPositionGetter.types';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import {
  selectorChartsKeyboardItem,
  selectorChartsKeyboardItemIsDefined,
} from '../useChartKeyboardNavigation';
import {
  selectorChartsInteractionItem,
  selectorChartsInteractionItemIsDefined,
  selectorChartsLastInteraction,
} from './useChartInteraction.selectors';
import { ChartSeriesConfig } from '../../models/seriesConfig/seriesConfig.types';
import {
  AxisId,
  ChartsRadiusAxisProps,
  ChartsRotationAxisProps,
  ChartsXAxisProps,
  ChartsYAxisProps,
} from '../../../../models/axis';
import { ComputeResult } from '../useChartCartesianAxis/computeAxisValue';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions/useChartDimensions.selectors';
import { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { isCartesianSeries } from '../../../isCartesian';
import {
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
} from '../useChartPolarAxis/useChartPolarAxis.selectors';
import { ComputeResult as ComputePolarResult } from '../useChartPolarAxis/computeAxisValue';

export const selectorChartsTooltipItem = createSelector(
  selectorChartsLastInteraction,
  selectorChartsInteractionItem,
  selectorChartsKeyboardItem,
  (lastInteraction, interactionItem, keyboardItem) =>
    lastInteraction === 'keyboard' ? keyboardItem : (interactionItem ?? null),
);

export const selectorChartsTooltipItemIsDefined = createSelector(
  selectorChartsLastInteraction,
  selectorChartsInteractionItemIsDefined,
  selectorChartsKeyboardItemIsDefined,

  (lastInteraction, interactionItemIsDefined, keyboardItemIsDefined) =>
    lastInteraction === 'keyboard' ? keyboardItemIsDefined : interactionItemIsDefined,
);

const selectorChartsTooltipAxisConfig = createSelector(
  selectorChartsTooltipItem,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartRotationAxis,
  selectorChartRadiusAxis,
  selectorChartSeriesProcessed,
  function selectorChartsTooltipAxisConfig<T extends ChartSeriesType>(
    identifier: ChartItemIdentifierWithData<T> | null,
    { axis: xAxis, axisIds: xAxisIds }: ComputeResult<ChartsXAxisProps>,
    { axis: yAxis, axisIds: yAxisIds }: ComputeResult<ChartsYAxisProps>,
    rotationAxes: ComputePolarResult<ChartsRotationAxisProps>,
    radiusAxes: ComputePolarResult<ChartsRadiusAxisProps>,
    series: ProcessedSeries<T>,
  ) {
    if (!identifier) {
      return {};
    }

    const itemSeries = series[identifier.type as T]?.series[identifier.seriesId] as
      | ChartSeriesDefaultized<T>
      | undefined;

    if (!itemSeries) {
      return {};
    }
    const axesConfig: TooltipPositionGetterAxesConfig = {
      rotationAxes,
      radiusAxes,
    };

    const xAxisId: AxisId | undefined = isCartesianSeries(itemSeries)
      ? (itemSeries.xAxisId ?? xAxisIds[0])
      : undefined;
    const yAxisId: AxisId | undefined = isCartesianSeries(itemSeries)
      ? (itemSeries.yAxisId ?? yAxisIds[0])
      : undefined;

    if (xAxisId !== undefined) {
      axesConfig.x = xAxis[xAxisId];
    }
    if (yAxisId !== undefined) {
      axesConfig.y = yAxis[yAxisId];
    }

    return axesConfig;
  },
);

export const selectorChartsTooltipItemPosition = createSelector(
  selectorChartsTooltipItem,
  selectorChartDrawingArea,
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
  selectorChartsTooltipAxisConfig,

  function selectorChartsTooltipItemPosition<T extends ChartSeriesType>(
    identifier: ChartItemIdentifierWithData<T> | null,
    drawingArea: ChartDrawingArea,
    seriesConfig: ChartSeriesConfig<T>,
    series: ProcessedSeries<T>,
    axesConfig: TooltipPositionGetterAxesConfig,
    placement: 'top' | 'bottom' | 'left' | 'right' = 'top',
  ) {
    if (!identifier) {
      return null;
    }

    const itemSeries = series[identifier.type as T]?.series[identifier.seriesId] as
      | ChartSeriesDefaultized<T>
      | undefined;

    if (!itemSeries) {
      return null;
    }
    return (
      seriesConfig[itemSeries.type as T].tooltipItemPositionGetter?.({
        series,
        drawingArea,
        axesConfig,
        identifier,
        placement,
      }) ?? null
    );
  },
);
