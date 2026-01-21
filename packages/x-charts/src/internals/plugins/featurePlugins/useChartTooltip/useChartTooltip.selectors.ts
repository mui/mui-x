import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type { SeriesItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesDefaultized, ChartSeriesType } from '../../../../models/seriesType/config';
import {
  type ProcessedSeries,
  selectorChartSeriesProcessed,
  selectorChartSeriesLayout,
  type SeriesLayout,
} from '../../corePlugins/useChartSeries';
import { type TooltipPositionGetterAxesConfig } from '../../models/seriesConfig/tooltipItemPositionGetter.types';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import {
  selectorChartsKeyboardItem,
  selectorChartsHasFocusedItem,
} from '../useChartKeyboardNavigation';
import { selectorChartsLastInteraction } from '../useChartInteraction/useChartInteraction.selectors';
import type { ChartSeriesConfig } from '../../models/seriesConfig/seriesConfig.types';
import type {
  AxisId,
  ChartsRadiusAxisProps,
  ChartsRotationAxisProps,
  ChartsXAxisProps,
  ChartsYAxisProps,
} from '../../../../models/axis';
import type { ComputeResult } from '../useChartCartesianAxis/computeAxisValue';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions/useChartDimensions.selectors';
import type { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { isCartesianSeries } from '../../../isCartesian';
import {
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
} from '../useChartPolarAxis/useChartPolarAxis.selectors';
import type { ComputeResult as ComputePolarResult } from '../useChartPolarAxis/computeAxisValue';
import type { ChartOptionalRootSelector } from '../../utils/selectors';
import type { UseChartTooltipSignature } from './useChartTooltip.types';
import { selectorChartSeriesConfig } from '../../corePlugins/useChartSeriesConfig';

const selectTooltip: ChartOptionalRootSelector<UseChartTooltipSignature> = (state) => state.tooltip;

export const selectorChartsTooltipPointerItem = createSelector(
  selectTooltip,
  (tooltip) => tooltip?.item ?? null,
);

export const selectorChartsTooltipPointerItemIsDefined = createSelector(
  selectorChartsTooltipPointerItem,
  (item) => item !== null,
);

export const selectorChartsTooltipItem = createSelector(
  selectorChartsLastInteraction,
  selectorChartsTooltipPointerItem,
  selectorChartsKeyboardItem,
  (lastInteraction, pointerItem, keyboardItem) =>
    lastInteraction === 'keyboard' ? keyboardItem : (pointerItem ?? null),
);

export const selectorChartsTooltipItemIsDefined = createSelector(
  selectorChartsLastInteraction,
  selectorChartsTooltipPointerItemIsDefined,
  selectorChartsHasFocusedItem,
  (lastInteraction, pointerItemIsDefined, keyboardItemIsDefined) =>
    lastInteraction === 'keyboard' ? keyboardItemIsDefined : pointerItemIsDefined,
);

const selectorChartsTooltipAxisConfig = createSelectorMemoized(
  selectorChartsTooltipItem,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartRotationAxis,
  selectorChartRadiusAxis,
  selectorChartSeriesProcessed,
  function selectorChartsTooltipAxisConfig<T extends ChartSeriesType>(
    identifier: SeriesItemIdentifier<T> | null,
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

export const selectorChartsTooltipItemPosition = createSelectorMemoized(
  selectorChartsTooltipItem,
  selectorChartDrawingArea,
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
  selectorChartSeriesLayout,
  selectorChartsTooltipAxisConfig,

  function selectorChartsTooltipItemPosition<T extends ChartSeriesType>(
    identifier: SeriesItemIdentifier<T> | null,
    drawingArea: ChartDrawingArea,
    seriesConfig: ChartSeriesConfig<T>,
    series: ProcessedSeries<T>,
    seriesLayout: SeriesLayout<T>,
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
        seriesLayout,
        drawingArea,
        axesConfig,
        identifier,
        placement,
      }) ?? null
    );
  },
);
