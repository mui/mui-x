import { createSelector } from '../../utils/selectors';
import { AxisItemIdentifier } from '../../../../models/axis';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';
import { ChartState } from '../../models/chart';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { selectorChartsInteractionPointerX, selectorChartsInteractionPointerY } from '../useChartInteraction';
import { getAxisIndex } from './getAxisValue';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { CartesianChartSeriesType } from '../../../../models/seriesType/config';
import { isCartesianSeriesType } from '../../../../internals/isCartesian';


const selectorChartControlledCartesianAxisTooltip = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.controlledCartesianAxisTooltip;


/**
 * Get x-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipXAxes = createSelector(
  [selectorChartsInteractionPointerX, selectorChartControlledCartesianAxisTooltip, selectorChartXAxis],
  (value, controlledAxies, axes) => {
    if (controlledAxies) { return controlledAxies.filter(axis => axes.axis[axis.axisId] !== undefined) }
    if (value === null) {
      return [];
    }

    return axes.axisIds
      .filter((id) => axes.axis[id].triggerTooltip)
      .map(
        (axisId): AxisItemIdentifier => ({
          axisId,
          dataIndex: getAxisIndex(axes.axis[axisId], value),
        }),
      )
      .filter(({ dataIndex }) => dataIndex >= 0);
  },
  {
    memoizeOptions: {
      // Keep the same reference if array content is the same.
      // If possible, avoid this pattern by creating selectors that
      // uses string/number as arguments.
      resultEqualityCheck: isDeepEqual,
    },
  },
);

/**
 * Get y-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipYAxes = createSelector(
  [selectorChartsInteractionPointerY, selectorChartControlledCartesianAxisTooltip, selectorChartYAxis],
  (value, controlledAxies, axes) => {
    if (controlledAxies) { return controlledAxies.filter(axis => axes.axis[axis.axisId] !== undefined) }
    if (value === null) {
      return [];
    }

    return axes.axisIds
      .filter((id) => axes.axis[id].triggerTooltip)
      .map(
        (axisId): AxisItemIdentifier => ({
          axisId,
          dataIndex: getAxisIndex(axes.axis[axisId], value),
        }),
      )
      .filter(({ dataIndex }) => dataIndex >= 0);
  },
  {
    memoizeOptions: {
      // Keep the same reference if array content is the same.
      // If possible, avoid this pattern by creating selectors that
      // uses string/number as arguments.
      resultEqualityCheck: isDeepEqual,
    },
  },
);


export const selectorChartsAxisTooltipPosition = createSelector(
  [selectorChartsInteractionTooltipXAxes, selectorChartsInteractionTooltipYAxes, selectorChartXAxis, selectorChartYAxis, selectorChartSeriesProcessed],
  (xTooltip, yTooltip, xAxes, yAxes, series) => {

    for (const item of [...xTooltip, ...yTooltip]) {
      const positions: { x: number; y: number }[] = []
      Object.keys(series)
        .filter(isCartesianSeriesType)
        .forEach(<SeriesT extends CartesianChartSeriesType>(seriesType: SeriesT) => {
          const seriesOfType = series[seriesType];
          if (!seriesOfType) {
            return;
          }
          seriesOfType.seriesOrder.forEach((seriesId) => {
            const seriesToAdd = seriesOfType.series[seriesId]!;

            const providedXAxisId = seriesToAdd.xAxisId ?? xAxes.axisIds[0];
            const providedYAxisId = seriesToAdd.yAxisId ?? yAxes.axisIds[0];

            if (item.axisId !== providedXAxisId && item.axisId !== providedYAxisId) { return null }
            const value = seriesToAdd.data[item.dataIndex] ?? null;

            if (value != null) {

              const isXAxis = providedXAxisId === item.axisId;

              const xAxis = xAxes.axis[providedXAxisId];
              const yAxis = xAxes.axis[providedXAxisId];
              const x = isXAxis ? xAxis.scale(xAxis.data[item.dataIndex])! : xAxis.scale(value)!
              const y = isXAxis ? yAxis.scale(value)! : yAxis.scale(yAxis.data[item.dataIndex])!
              console.log(x, y)
              positions.push({ x, y })
            }

          });
        })

      if (positions.length > 0) { return positions[0] }
    }
    return null
  }
);

/**
 * Return `true` if the axis tooltip has something to display.
 */
export const selectorChartsInteractionAxisTooltip = createSelector(
  [selectorChartsInteractionTooltipXAxes, selectorChartsInteractionTooltipYAxes],
  (xTooltip, yTooltip) => xTooltip.length > 0 || yTooltip.length > 0,
);

