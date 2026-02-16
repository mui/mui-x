'use client';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { useBarSeriesContext, useXAxes, useYAxes } from '../hooks';
import type { BarSeriesType, FocusedItemIdentifier } from '../models/seriesType';
import type { ChartsAxisProps } from '../models/axis';


export interface UseFocusedBarDataReturn<AxisValue extends { toString(): string } = { toString(): string }> {
  /**
   * The identifier of the focused item.
   */
  focusedItem: FocusedItemIdentifier<'bar'>;
  /**
   * The data about the focused axis value.
   */
  axis: Pick<ChartsAxisProps, 'label'> & { value: AxisValue };
  /**
   * The data about the focused series value.
   */
  series: Pick<BarSeriesType, 'label'> & {
    value: number | null;
  }
}

/**
 * Returns data about the currently focused bar item (from keyboard navigation).
 *
 * If no bar item is focused, returns `null`.
 *
 * @returns The focused bar data, or `null`.
 */
export function useFocusedBarData(): UseFocusedBarDataReturn | null {
  const focusedItem = useFocusedItem();
  const barSeries = useBarSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  if (focusedItem === null || focusedItem.type !== 'bar' || !barSeries) {
    return null;
  }

  const { dataIndex, seriesId } = focusedItem;
  const series = barSeries.series[seriesId];

  if (!series) {
    return null;
  }

  const verticalLayout = series.layout === 'vertical';
  const categoryAxisId = verticalLayout
    ? (series.xAxisId ?? xAxisIds[0])
    : (series.yAxisId ?? yAxisIds[0]);

  const categoryAxis = verticalLayout ? xAxis[categoryAxisId] : yAxis[categoryAxisId];

  const axisValue = categoryAxis.data?.[dataIndex] ?? null;
  const axisLabel = categoryAxis.label;

  const seriesValue = series.data[dataIndex] ?? null;

  return {
    focusedItem,
    axis: {
      value: axisValue,
      label: axisLabel,
    },
    series: {
      value: seriesValue,
      label: series.label,
    }
  };
}
